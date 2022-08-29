const { default: axios } = require('axios')
const { URLSearchParams } = require('url')

let bookingCode, courseSession, courseTitle
let studentInfo = { studentName: '', nickname: '' }

;(async () => {
    const foo = new URLSearchParams()
    foo.append(
        'message',
        `หมายเลขการจอง: ${bookingCode}\n
    ลงวิชา: ${courseTitle} รอบ ${courseSession}\n
    ชื่อผู้เรียน: ${studentInfo.studentName} (${studentInfo.nickname})
    ช่องทางชำระ: test\n
    ยอดชำระ:0\n
    ดูใบเสร็จ: `
    )
    const { data } = await axios.post('https://api.line.me/v2/bot/message/push', payload, {
        headers: {
            Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
            'Content-Type': 'application/json',
            'X-Line-Retry-Key': `${dayjs().format('YYYYMMDD')}-${Math.random().toString(36).substring(1)}`,
        },
    })
    console.log(data)
})()
