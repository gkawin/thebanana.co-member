import useMyBooking, { BookingInfo } from '@/concerns/use-my-booking'
import { BookingGroup, BookingStatus, PaymentMethod } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'

export const ObservationPaymentStatusContent: React.VFC<{ chargeResult?: any }> = ({ chargeResult }) => {
    const { items: upCommingItems } = useMyBooking({
        bookingCode: chargeResult.bookingCode,
        bookingGroup: BookingGroup.UpComming,
    })
    const { items: haltItems } = useMyBooking({
        bookingCode: chargeResult.bookingCode,
        bookingGroup: BookingGroup.Cancelled,
    })

    if (upCommingItems.length === 0 && haltItems.length === 0) return null

    let bookingInfo: BookingInfo
    if (upCommingItems.length > 0) {
        bookingInfo = upCommingItems[0]
    }

    if (haltItems.length > 0) {
        bookingInfo = haltItems[0]
    }

    const isPromptPay = bookingInfo.paymentMethod === PaymentMethod.PROMPT_PAY

    const renderMyBookingLink = () => {
        return (
            <Link href="/my/booking">
                <a type="button" className="p-2 text-center bg-indigo-700 text-white w-full rounded text-sm">
                    ไปหน้าคอร์สเรียนของฉัน
                </a>
            </Link>
        )
    }

    if (isPromptPay) {
        switch (bookingInfo.status) {
            case BookingStatus.CREATED: {
                return (
                    <div className="relative">
                        <span className="font-thin block">กรุณาทำรายการผ่าน app ธนาคาร</span>
                        <Image
                            unoptimized
                            src={chargeResult?.metadata?.downloadUri}
                            alt="qr_code"
                            layout="intrinsic"
                            width={300}
                            height={300}
                        />
                    </div>
                )
            }
            case BookingStatus.PAID: {
                return (
                    <div>
                        <div className="text-xl">ขอบคุณสำหรับการชำระค่าบริการ</div>
                        {renderMyBookingLink()}
                    </div>
                )
            }

            case BookingStatus.CANCELLED:
            case BookingStatus.REJECTED:
                return (
                    <div>
                        <Link href={{ pathname: '/my/booking', query: { tabGroup: BookingGroup.Cancelled } }}>
                            <a type="button" className="p-2 text-center bg-red-700 text-white w-full rounded text-sm">
                                ไปหน้าจัดการจอง เพื่อตรวจสอบข้อผิดพลาด
                            </a>
                        </Link>
                    </div>
                )
            default:
                return renderMyBookingLink()
        }
    }

    return null
}
