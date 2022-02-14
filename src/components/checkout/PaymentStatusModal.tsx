import { PaymentStep } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import ReactModal from 'react-modal'

export type PaymentStatusModalProps = { paymentCompleted: boolean }

export const PaymentStatusModal: React.VFC<PaymentStatusModalProps> = ({ paymentCompleted }) => {
    const router = useRouter()

    const icon = paymentCompleted ? faCheckCircle : faTimesCircle
    const message = paymentCompleted ? 'ชำระเงินสำเร็จ' : 'ชำระเงินไม่สำเร็จ กรุณาติดต่อเจ้าหน้าที่'

    const handleClick = () => {
        if (paymentCompleted) {
            router.push('/')
        }
    }

    return (
        <ReactModal
            isOpen={paymentCompleted}
            className=" p-4 bg-white m-auto w-10/12 border border-gray-200 rounded transform translate-y-1/3"
        >
            <div className="flex flex-col space-y-4">
                <div className="self-center">
                    <FontAwesomeIcon icon={icon} color={paymentCompleted ? 'green' : 'red'} size="4x" />
                </div>
                <div className="grid gap-y-4 text-center space-y-4">
                    <div className="text-2xl">
                        <div className="font-light">หมายเลขการชำระเงิน </div>
                        <div className="font-semibold">X234236DD</div>
                    </div>

                    {message}
                </div>
                <button type="button" className="p-2 bg-indigo-500 text-white w-full rounded" onClick={handleClick}>
                    ปิด
                </button>
            </div>
        </ReactModal>
    )
}
