import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import puppeteer from 'puppeteer'

import { withThaiDateFormat } from '../../src/utils/date'
import thaiBath from '../../src/utils/thai-bath'
import { withPricing } from '../../src/utils/payment'
import { BookingStatus, PaymentMethodLabel } from '../../src/constants'
import { generateReceiptFromHtml } from './receipt'

admin.initializeApp()

const func = functions.region('asia-southeast1')
const storage = admin.storage().bucket()
const db = admin.firestore()

export const generateReceipt = func
    .runWith({ memory: '1GB', timeoutSeconds: 540 })
    .firestore.document('/booking/{bookingCode}')
    .onWrite(async (change, context) => {
        const { status, receipt, ...info } = change.after.data()
        const bookingCode = context.params.bookingCode
        const receiptId = `rcpt_${bookingCode}`

        console.log(JSON.stringify({ bookingCode, receiptId, status }))

        if (status !== BookingStatus.PAID || receipt) return

        const userRef = info?.user as FirebaseFirestore.DocumentReference

        if (!userRef) return

        const courseRef = info?.course as FirebaseFirestore.DocumentReference
        const { title: courseTitle = '', session: courseSession = '' } = (await courseRef.get()).data()
        const userId = (await userRef.get()).id
        const { nickname = '', firstname = '', lastname = '' } = (await userRef.get()).data()
        const shippingAddressRef = info?.shippingAddress as FirebaseFirestore.DocumentReference
        const address = (await shippingAddressRef.get()).data()?.address ?? ''

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
            parentName: 'test',
            receiptId,
            totalPricing: withPricing(info?.price ?? 0),
            listCoursesEnrolled: [{ course: courseTitle, session: courseSession, pricing: info?.price }],
            totalPricingThai: thaiBath(info?.price ?? 0),
            nickname,
            studentName: `${firstname} ${lastname}`,
            paymentMethodLabel: PaymentMethodLabel.get(info?.paymentMethod),
        })

        await page.setContent(dehydrateHtml, { waitUntil: 'networkidle2' })

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { bottom: 10, left: 10, right: 10, top: 10 },
        })
        await browser.close()

        const filepath = `receipts/${userId}/${receiptId}.pdf`
        console.time(`saving pdf file ${filepath}`)
        const file = storage.file(filepath)

        await file.save(pdf, {
            contentType: 'application/pdf',
            metadata: {
                createdAt: new Date(),
                userId,
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
                status: BookingStatus.PAID,
            })

        console.timeEnd(`saving pdf file ${filepath}`)
    })
