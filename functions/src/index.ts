import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import puppeteer from 'puppeteer'

admin.initializeApp()

const func = functions.region('asia-southeast1')
const storage = admin.storage().bucket('thebanana-member.appspot.com')

export const receipt = func
    .runWith({
        ingressSettings: 'ALLOW_INTERNAL_ONLY',
    })
    .https.onRequest((req, res) => {
        const template = `
    <!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>foo</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>
  <div id="invoice" class="text-sm font-light font-invoice container m-auto">
    <div class="flex flex-row flex-wrap w-full justify-between py-2">
      <figure class="content-center max-w-xs">
        <img src="https://www.thebanana.co/images/logo.png" alt="stamped" />
      </figure>
      <div class="max-w-xs text-right">
        <div class="text-lg font-medium">ใบเสร็จรับเงิน</div>
        <div class="text-xs">
          บริษัท วันบุ๊ค จำกัด <br /> 89/91 หมู่ 10 หมู่บ้านทาวน์ อเวนิว เมิร์จ <br /> ต. บางรักใหญ่
          อ.บางบัวทอง จ.นนทบุรี 11110
        </div>
        <div class="text-xs">เลขประจำตัวผู้เสียภาษี: 0125563000591</div>
      </div>
    </div>
    <div class="flex flex-row justify-between">
      <div class="box-border w-full mr-2 p-2 border border-gray-900">
        <div class="font-semibold text-lg">รายละเอียดลูกค้า</div>
        <div>${req.body.parentName}</div>
        <div>${req.body.address}</div>
        <div>เลขประจำตัวผู้เสียภาษี: ${req.body.taxId}</div>}
      </div>
      <div class="box-border w-full p-2 border border-gray-900">
        <div>เลขที่ใบเสร็จ: ${req.body.docId}</div>
        <div>วันที่: ${req.body.createdAt}</div>
      </div>
    </div>
    <div class="border-black border my-3" />
    <div class="grid grid-cols-2">
      <div>${req.body.amount} บาท</div>
      <div class="grid grid-cols-2 text-right gap-y-2">
        <div class="font-semibold">จำนวนเงินรวมทั้งสิ้น</div>
        <div>
            ${req.body.totalAmount}
          บาท
        </div>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-2 text-center">
      <div class="flex flex-col justify-center">
        <div>......วัชรีพร แก้วบุตรดี......</div>
        <div class="font-semibold">ผู้รับเงิน</div>
      </div>
      <div class="self-end">
        <div>${req.body.createdAt}</div>
        <div class="font-semibold">วันที่รับเงิน</div>
      </div>
    </div>
    <div className="text-xs mt-16">
      (เอกสารฉบับนี้มีการลงรายมืออิเล็กทรอนิกส์ กรุณารักษาเอกสารฉบับนี้เอาไว้เพื่อการอ้างอิง)
    </div>
  </div>
</body>
</html>
    `
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.status(200).send(template)
    })

export const generateReceipt = func
    .runWith({ memory: '1GB', timeoutSeconds: 540 })
    .firestore.document('/booking/{bookingId}')
    .onWrite(async (change, context) => {
        const bookingId = context.params.bookingId
        const userRef = change.after.data()?.user as FirebaseFirestore.DocumentReference

        if (!userRef) return

        const receiptId = `rcpt_${bookingId}`
        const userId = 'testId'

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true,
            ignoreHTTPSErrors: true,
        })
        const page = await browser.newPage()

        await page.goto(
            `https://asia-southeast1-thebanana-member.cloudfunctions.net/receipt?date=${new Date().getTime()}`,
            {
                waitUntil: 'networkidle2',
                timeout: 10000,
            }
        )
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { bottom: 0, left: 0, right: 0, top: 0 },
        })
        await browser.close()

        const filepath = `/users/${userId}/receipts/${receiptId}.pdf`

        console.time(`saving pdf file ${filepath}`)
        const saveResult = await storage.file(filepath).save(pdf, { contentType: 'application/pdf' })
        console.timeEnd(`saving pdf file ${filepath}`)
        // console.time('update ready to download content')
        // const updateResult = await db.collection('transactions').doc(invoiceId).update({ downloadable: true })
        // console.timeEnd('update ready to download content')
        console.log('result:: ', saveResult)
    })
