import useMyBooking from '@/concerns/use-my-booking'
import { BookingStatus, PaymentMethod } from '@/constants'
import { withThaiDateFormat } from '@/utils/date'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { SpinLoading } from '../portal/SpinLoading'

type PaymentActivityInfoProps = {
    bookingCode: string
}

export const PaymentActivityInfo: React.FC<PaymentActivityInfoProps> = ({ bookingCode }) => {
    const { items: bookingList } = useMyBooking({ bookingCode })

    useEffect(() => {
        if (bookingList.length > 0) {
            const booking = bookingList[0]
            if (booking.status === BookingStatus.PAID) {
                window.liff.sendMessages([
                    {
                        type: 'text',
                        text: `ชำระค่าเรียน ${booking.productName} ราคา ${booking.pricing} เรียบร้อยแล้ว`,
                    },
                ])
            }
        }
    }, [bookingList])

    if (bookingList.length === 0)
        return (
            <div>
                <h1 className="text-2xl">กำลังประมวลผล ห้ามปิดหน้าจอ</h1>
                <SpinLoading isLoading />
            </div>
        )

    const booking = bookingList[0]
    const isPromptPay = booking.paymentMethod === PaymentMethod.PROMPT_PAY

    if (isPromptPay && booking.status === BookingStatus.PENDING) {
        return (
            <div className="text-center space-y-4">
                <div>
                    กรุณาสแกน QR Code เพื่อชำระเงินภายในวันที่{' '}
                    {withThaiDateFormat(booking.promptPayInfo.expiryDate.toISOString(), 'DD MMMM BBBB เวลา HH:mm น.')}
                </div>
                <div className="relative">
                    <Image
                        unoptimized
                        src={booking.promptPayInfo.qrCodeImage}
                        alt="qr_code"
                        layout="intrinsic"
                        width={300}
                        height={300}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="text-center space-y-4">
            <div className="text-sm">หมายเลขการจอง</div>
            <div className="text-2xl font-semibold">{booking.bookingCode}</div>
            <div className="text-xs text-gray-500">กรุณาบันทึกหมายเลขการจองนี้ไว้เพื่อตรวจสอบ</div>
            <div className="text-xs flex justify-between">
                <span className="text-gray-500">หมายเลขใบเสร็จ</span>
                <span className="">{booking.billingId}</span>
            </div>
            <Link href={{ pathname: '/my/booking' }}>
                <a className="p-2 bg-indigo-500 rounded block text-white">ไปยังการจองของฉัน</a>
            </Link>
        </div>
    )
}
