import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import puppeteer from 'puppeteer'
import Handlebars from 'handlebars'

import fs from 'fs'
import path from 'path'

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
    amount: string
    totalAmount: string
}

export const generateReceipt = func
    .runWith({ memory: '1GB', timeoutSeconds: 540 })
    .firestore.document('/booking/{bookingCode}')
    .onWrite(async (change, context) => {
        const bufferString = fs.readFileSync(path.resolve(__dirname, './html/receipt-template.html'))
        const template = Handlebars.compile<ReceiptTemplateProps>(bufferString.toString('utf-8'))

        const bookingCode = context.params.bookingCode
        const userRef = change.after.data()?.user as FirebaseFirestore.DocumentReference

        if (!userRef) return

        const receiptId = `rcpt_${bookingCode}`
        const userId = (await userRef.get()).id

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            ignoreHTTPSErrors: true,
        })
        const page = await browser.newPage()

        await page.setContent(
            template({
                address: 'test',
                amount: '1000.00',
                createdAt: ' test',
                parentName: 'test',
                receiptId: '11111',
                taxId: '111111',
                totalAmount: '1111',
            })
        )

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
        })
        await browser.close()

        const filepath = `users/${userId}/receipts/${receiptId}.pdf`

        console.time(`saving pdf file ${filepath}`)

        const file = storage.file(filepath)

        await file.save(pdf, { contentType: 'application/pdf' })

        return await db
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
            .then(() => {
                console.timeEnd(`saving pdf file ${filepath}`)
            })
    })
