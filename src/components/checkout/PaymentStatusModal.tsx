import { PaymentMethod } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import buddhishEra from 'dayjs/plugin/buddhistEra'
import 'dayjs/locale/th'
import Image from 'next/image'
import ReactModal from 'react-modal'
import Link from 'next/link'

dayjs.extend(buddhishEra)
dayjs.locale('th')

export const PaymentStatusModal: React.FC = () => {
    const { chargeResult } = usePaymentContext()
    const paymentCompleted = !!chargeResult

    const icon = paymentCompleted ? faCheckCircle : faTimesCircle

    const renderQRCodeImage = () => {
        if (!paymentCompleted) return null
        if (chargeResult.source === PaymentMethod.PROMPT_PAY) {
            return (
                <div className="relative">
                    <div>
                        <span className="font-thin">กรุณาทำรายการก่อนวันที่</span>{' '}
                        <span className="font-semibold text-red-500 underline">
                            {dayjs(chargeResult.expiredDate).format('DD MMMM BBBB HH:MM')}
                        </span>
                    </div>
                    <Image
                        unoptimized
                        src={chargeResult.metadata.downloadUri}
                        alt="qr_code"
                        layout="intrinsic"
                        width={300}
                        height={300}
                    />
                </div>
            )
        }
        return null
    }

    return (
        <ReactModal
            isOpen={paymentCompleted}
            className=" p-4 bg-white m-auto w-10/12 border border-gray-200 rounded transform translate-y-8"
        >
            <div className="flex flex-col space-y-4 relative">
                <div className="self-center">
                    <FontAwesomeIcon icon={icon} color={paymentCompleted ? 'green' : 'red'} size="4x" />
                </div>
                <div className="grid gap-y-4 text-center space-y-4">
                    <div className="text-xl">
                        <div className="font-light">หมายเลขการชำระเงิน </div>
                        <div className="font-semibold">{chargeResult?.bookingCode}</div>
                    </div>
                    {renderQRCodeImage()}
                </div>
                <Link href="/my/booking">
                    <a type="button" className="p-2 text-center bg-indigo-700 text-white w-full rounded">
                        ไปหน้าคอร์สเรียนของฉัน
                    </a>
                </Link>
            </div>
        </ReactModal>
    )
}
