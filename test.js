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
    const data = await axios.post('https://notify-api.line.me/api/notify', foo.toString(), {
        headers: {
            Authorization: `Bearer ecMapsKWBH4Ar73UcgwDRheMSWMcqceLNG65yK0LGPc`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    console.log(data)
})()
