import axios from 'axios'
import { PaymentMethod, PaymentMethodLabel } from '../../../src/constants'

export const confirmPaymentWithPushMessage = async (
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

export const notifyCustomerPayment = async (props: {
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
