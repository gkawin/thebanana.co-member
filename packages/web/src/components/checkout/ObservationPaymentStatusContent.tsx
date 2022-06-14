import useMyBooking, { BookingInfo } from 'packages/web/src/concerns/use-my-booking'
import { BookingGroup, PaymentMethod } from 'packages/web/src/constants'
import Image from 'next/image'

export type ObservationPaymentStatusContentProps = {
    bookingCode: string
    paymentMethod: PaymentMethod
    imageUri?: string
}

export const ObservationPaymentStatusContent: React.VFC<ObservationPaymentStatusContentProps> = ({
    bookingCode,
    paymentMethod,
    imageUri,
}) => {
    const { items: upCommingItems } = useMyBooking({
        bookingCode,
        bookingGroup: BookingGroup.UpComming,
    })
    const { items: haltItems } = useMyBooking({
        bookingCode: bookingCode,
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

    // const renderMyBookingLink = () => {
    //     return (
    //         <Link href="/my/booking">
    //             <a type="button" className="p-2 text-center bg-indigo-700 text-white w-full rounded text-sm">
    //                 ไปหน้าคอร์สเรียนของฉัน
    //             </a>
    //         </Link>
    //     )
    // }

    return (
        <div>
            {paymentMethod === PaymentMethod.PROMPT_PAY && (
                <div className="relative">
                    <span className="font-thin block">กรุณาทำรายการผ่าน app ธนาคาร</span>
                    <Image unoptimized src={imageUri} alt="qr_code" layout="intrinsic" width={300} height={300} />
                    {JSON.stringify(bookingInfo)}
                </div>
            )}
        </div>
    )
}
