import { BookingStatus } from '@/constants'
import { PaymentActivityInfo } from '../checkout/PaymentStatusModal'

export type ReminderBarProps = {
    bookingStatus: BookingStatus
    bookingCode: string
    qrImage?: string
}

export const ReminderBar: React.FC<ReminderBarProps> = ({ bookingStatus, bookingCode, qrImage = '' }) => {
    if (bookingStatus !== BookingStatus.PENDING) return null
    return (
        <div className="py-4 text-center b border border-red-300 bg-red-50 text-red-700 rounded">
            กรุณาชำระเงิน
            <PaymentActivityInfo bookingCode={bookingCode} qrImage={qrImage} />
        </div>
    )
}
