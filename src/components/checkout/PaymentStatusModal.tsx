import { usePaymentContext } from '@/core/PaymentContext'
import ReactModal from 'react-modal'
import { ObservationPaymentStatusContent } from './ObservationPaymentStatusContent'

export const PaymentStatusModal: React.FC = () => {
    const { chargeResult } = usePaymentContext()
    return (
        <ReactModal
            isOpen={!!chargeResult}
            className=" p-4 bg-white m-auto w-10/12 border border-gray-200 rounded transform translate-y-8"
        >
            <div className="flex flex-col space-y-4">
                <div className="grid gap-y-4 text-center">
                    <div className="text-xl space-y-4">
                        <div className="text-gray-500">หมายเลขการจองของคุณคือ</div>
                        <div className="text-2xl">{chargeResult?.bookingCode}</div>
                    </div>
                    <ObservationPaymentStatusContent chargeResult={chargeResult} />
                </div>
            </div>
        </ReactModal>
    )
}
