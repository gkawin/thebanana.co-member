import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import puppeteer from 'puppeteer'
import Handlebars from 'handlebars'

import fs from 'fs'
import path from 'path'

import { withPricing } from '../../src/utils/payment'

admin.initializeApp()

const func = functions.region('asia-southeast1')
const storage = admin.storage().bucket()
const db = admin.firestore()

type ReceiptTemplateProps = {
    parentName: string
    address: string
    taxId: string
    receiptId: string
    createdAt: string
    pricing: string
    totalPricing: string
    courses: any[]
}

export const generateReceipt = func
    .runWith({ memory: '1GB', timeoutSeconds: 540 })
    .firestore.document('/booking/{bookingCode}')
    .onCreate(async (change, context) => {
        const bufferString = fs.readFileSync(path.resolve(__dirname, './html/receipt-template.html'))
        const template = Handlebars.compile<ReceiptTemplateProps>(bufferString.toString('utf-8'))

        const bookingCode = context.params.bookingCode
        const bookingData = change.data()
        const userRef = bookingData?.user as FirebaseFirestore.DocumentReference

        if (!userRef) {
            console.error(`User ${userRef} not exist.`)
        }

        const receiptId = `rcpt_${bookingCode}`
        const userId = (await userRef.get()).id

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            ignoreHTTPSErrors: true,
        })
        const page = await browser.newPage()

        const pricing = `${withPricing(bookingData?.price ?? 0)} บาท`

        await page.setContent(
            template({
                address: 'test',
                pricing,
                createdAt: ' test',
                parentName: 'test',
                receiptId,
                taxId: '111111',
                totalPricing: '1111',
                courses: [],
            })
        )

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { bottom: 10, left: 10, right: 10, top: 10 },
        })
        await browser.close()

        const filepath = `users/${userId}/receipts/${receiptId}.pdf`

        console.time(`saving pdf file ${filepath}`)

        const file = storage.file(filepath)

        await file.save(pdf, { contentType: 'application/pdf' })

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
