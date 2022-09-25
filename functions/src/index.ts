import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import puppeteer from 'puppeteer'
import axios, { AxiosError } from 'axios'
import crypto from 'crypto'
import { URLSearchParams } from 'url'

import { withThaiDateFormat } from '../../src/utils/date'
import thaiBath from '../../src/utils/thai-bath'
import { withPricing } from '../../src/utils/payment'
import { BookingStatus, PaymentMethod, PaymentMethodLabel } from '../../src/constants'
import { generateReceiptFromHtml } from './receipt'

admin.initializeApp()

const func = functions.region('asia-southeast1')
const storage = admin.storage().bucket()
const db = admin.firestore()

const confirmPaymentWithPushMessage = async (
    to: string,
    props: { bookingCode: string; pricing: string; paymentMethod: PaymentMethod }
) => {
    const content = `สถาบัน The Banana ขอบพระคุณสำหรับการชำระเงิน ท่านสามารถตรวจสอบรายละเอียดคอร์สเรียนได้ที่เมนู "การจองของฉัน"
หมายเลขการชำระ ${props.bookingCode}
ยอดชำระ ${props.pricing}
ช่องทางชำระ: ${PaymentMethodLabel.get(props.paymentMethod)}`
    const payload = {
        to,
        messages: [
            {
                type: 'text',
                text: content,
            },
        ],
    }

    const { data } = await axios.post('https://api.line.me/v2/bot/message/push', payload, {
        headers: {
            Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
            'Content-Type': 'application/json',
            'X-Line-Retry-Key': crypto.randomUUID(),
        },
    })

    return data
}

const notifyCustomerPayment = async (props: {
    bookingCode: string
    course: string
    stdName: string
    paymentMethod: PaymentMethod
    pricing: string
}) => {
    const payload = new URLSearchParams()
    payload.append(
        'message',
        `หมายเลขการจอง: ${props.bookingCode}
ลงวิชา: ${props.course}
ชื่อผู้เรียน: ${props.stdName}
ช่องทางชำระ: ${PaymentMethodLabel.get(props.paymentMethod)}
ยอดชำระ: ${props.pricing}`
    )

    const { data } = await axios.post('https://notify-api.line.me/api/notify', payload.toString(), {
        headers: {
            Authorization: `Bearer ${process.env.LINE_NOTIFY_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })

    return data
}

export const sendPaymentNotify = func.firestore.document('/booking/{bookingCode}').onUpdate(async (change) => {
    const { receipt, paymentMethod, price, studentInfo, bookingCode, course, user } = change.after.data()
    const userRef = user as FirebaseFirestore.DocumentReference

    if (!receipt || !userRef) return

    const courseRef = course as FirebaseFirestore.DocumentReference
    const { title: courseTitle = '', session: courseSession = '' } = (await courseRef.get()).data()
    const { socialId: to } = (await userRef.get()).data()

    const pricing = withPricing(price || 0)

    try {
        const createListOfNotify = [
            confirmPaymentWithPushMessage(to, { bookingCode, paymentMethod, pricing }),
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
    .onUpdate(async (change, context) => {
        const data = change.after.data()
        const previousData = change.before.data()

        if (data.status === previousData.status) {
            return null
        }

        if (data.status !== 'PAID') {
            return null
        }

        const bookingCode = context.params.bookingCode
        const receiptId = `rcpt_${bookingCode}`

        console.log('=== generateReceipt ===', JSON.stringify({ bookingCode, receiptId, status: data.status }))

        const userRef = data?.user as FirebaseFirestore.DocumentReference

        if (!userRef) return

        const courseRef = data?.course as FirebaseFirestore.DocumentReference
        const { title: courseTitle = '', session: courseSession = '' } = (await courseRef.get()).data()
        const userId = (await userRef.get()).id
        const { nickname = '', studentName = '' } = data?.studentInfo ?? {}
        const shippingAddressRef = data?.shippingAddress as FirebaseFirestore.DocumentReference
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
