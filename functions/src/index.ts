import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import puppeteer from 'puppeteer'
import { AxiosError } from 'axios'

import { withThaiDateFormat } from '../../src/utils/date'
import thaiBath from '../../src/utils/thai-bath'
import { withPricing } from '../../src/utils/payment'
import { BookingStatus, PaymentMethodLabel } from '../../src/constants'
import { generateReceiptFromHtml } from './receipt'
import { confirmPaymentWithPushMessage, notifyCustomerPayment } from './notification/line-noti'

admin.initializeApp()

const func = functions.region('asia-southeast1')
const storage = admin.storage().bucket()
const db = admin.firestore()

export const sendPaymentNotify = func.firestore.document('/booking/{bookingCode}').onWrite(async (change) => {
    const data = change.after.data()
    // NOTE: Which means deleted all data.
    if (!data) return null

    if (data.receipt || data.status !== 'PAID') return null

    const { bookingCode, paymentMethod, studentInfo, user, course } = data

    const userRef = user as FirebaseFirestore.DocumentReference

    const courseRef = course as FirebaseFirestore.DocumentReference
    const { title: courseTitle = '', session: courseSession = '' } = (await courseRef.get()).data()
    const { socialId: to } = (await userRef.get()).data()

    const pricing = withPricing(data.price || 0)

    try {
        const createListOfNotify = [
            confirmPaymentWithPushMessage(to, {
                bookingCode,
                paymentMethod,
                pricing,
            }),
            notifyCustomerPayment({
                bookingCode,
                course: `ลงวิชา ${courseTitle} รอบ ${courseSession}`,
                paymentMethod,
                pricing,
                stdName: `${studentInfo.studentName} (${studentInfo.nickname})`,
            }),
        ]

        const pushMsgResult = await Promise.all(createListOfNotify)
        console.log(' ======= pushMsgResult :: createListOfNotify =====', pushMsgResult)
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(error.response.data)
            console.error(error.config)
            console.error(error.status)
        }
    }
})

export const generateReceipt = func
    .runWith({ memory: '1GB', timeoutSeconds: 540 })
    .firestore.document('/booking/{bookingCode}')
    .onWrite(async (change, context) => {
        const data = change.after.data()

        // NOTE: Which means deleted all data.
        if (!data) return null

        if (data.receipt || data.status !== 'PAID') return null

        const bookingCode = context.params.bookingCode
        const receiptId = `rcpt_${bookingCode}`

        console.log('=== generateReceipt ===', JSON.stringify({ bookingCode, receiptId, status: data.status }))

        const userRef = data?.user as FirebaseFirestore.DocumentReference

        if (!userRef) return

        const courseRef = data?.course as FirebaseFirestore.DocumentReference
        const { title: courseTitle = '', session: courseSession = '' } = (await courseRef.get()).data()
        const userGetRef = await userRef.get()
        const { nickname = '', studentName = '' } = data?.studentInfo ?? {}
        const shippingAddressRef = data?.shippingAddress as FirebaseFirestore.DocumentReference
        const address = (await shippingAddressRef.get()).data()?.address ?? ''
        const userData = userGetRef.data()

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            ignoreHTTPSErrors: true,
        })
        const page = await browser.newPage()

        const dehydrateHtml = generateReceiptFromHtml({
            address,
            isShownBuyerTaxId: false,
            createdAt: withThaiDateFormat(new Date().toISOString()),
            parentName: `${userData.firstname} ${userData.lastname}`,
            receiptId,
            totalPricing: withPricing(data?.price ?? 0),
            listCoursesEnrolled: [{ course: courseTitle, session: courseSession, pricing: data?.price }],
            totalPricingThai: thaiBath(data?.price ?? 0),
            nickname,
            studentName,
            paymentMethodLabel: PaymentMethodLabel.get(data?.paymentMethod),
        })

        await page.setContent(dehydrateHtml, { waitUntil: 'networkidle2' })

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { bottom: 16, left: 16, right: 16, top: 16 },
        })
        await browser.close()

        const filepath = `receipts/${userGetRef.id}/${receiptId}.pdf`
        console.time(`saving pdf file ${filepath}`)
        const file = storage.file(filepath)

        await file.save(pdf, {
            contentType: 'application/pdf',
            metadata: {
                createdAt: new Date(),
                userId: userGetRef.id,
            },
        })
        await db
            .collection('booking')
            .doc(bookingCode)
            .update({
                receipt: {
                    receiptId,
                    downloadable: true,
                    filepath,
                    createdAt: new Date(),
                },
            })

        console.timeEnd(`saving pdf file ${filepath}`)
    })
