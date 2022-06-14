import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import puppeteer from 'puppeteer'
import Handlebars from 'handlebars'

import fs from 'fs'
import path from 'path'

import { withThaiDateFormat } from '../../web/src/utils/date'
import thaiBath from '../../web/src/utils/thai-bath'
import { withPricing } from '../../web/src/utils/payment'
import { PaymentMethodLabel } from '../../web/src/constants'

admin.initializeApp()

const func = functions.region('asia-southeast1')
const storage = admin.storage().bucket()
const db = admin.firestore()

Handlebars.registerHelper('math', function (lvalue, operator, rvalue): any {
    lvalue = parseFloat(lvalue)
    rvalue = parseFloat(rvalue)

    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue,
    }[operator]
})

type ReceiptTemplateProps = {
    parentName: string
    address: string
    buyerTaxId?: string
    receiptId: string
    createdAt: string
    totalPricing: string
    totalPricingThai: string
    listCoursesEnrolled: { uid?: string; course: string; session: string; pricing: number }[]
    isShownBuyerTaxId: boolean
    studentName: string
    nickname: string
    paymentMethodLabel: string
}

export const generateReceipt = func
    .runWith({ memory: '1GB', timeoutSeconds: 540 })
    .firestore.document('/booking/{bookingCode}')
    .onCreate(async (change, context) => {
        const bufferString = fs.readFileSync(path.resolve(__dirname, './html/receipt-template.handlebars'))
        const template = Handlebars.compile<ReceiptTemplateProps>(bufferString.toString('utf-8'))

        const bookingCode = context.params.bookingCode
        const info = change.data()
        const userRef = info?.user as FirebaseFirestore.DocumentReference

        if (!userRef) {
            console.error(`User ${userRef} not exist.`)
        }

        const receiptId = `rcpt_${bookingCode}`
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

        await page.setContent(
            template({
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
            }),
            {
                waitUntil: 'networkidle2',
            }
        )

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

        db.collection('booking')
            .doc(bookingCode)
            .update({
                receipt: {
                    receiptId,
                    downloadable: true,
                    filepath,
                    createdAt: new Date(),
                },
            })
            .then(() => {
                console.timeEnd(`saving pdf file ${filepath}`)
            })
    })
