import { usePaymentContext } from '@/core/PaymentContext'
import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { PaymentActivityInfo } from './PaymentActivityInfo'

export const PaymentStatusModal: React.FC = () => {
    const { chargeResult } = usePaymentContext()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!!chargeResult) {
            setIsOpen((currentState) => {
                if (currentState === !!chargeResult) return currentState
                return !!chargeResult
            })
        }
    }, [chargeResult, chargeResult?.status])

    const handleClickButton = () => {
        setIsOpen(false)
    }

    return (
        !!chargeResult && (
            <ReactModal
                isOpen={isOpen}
                className=" p-4 bg-white m-auto w-10/12 border border-gray-200 rounded transform translate-y-8"
            >
                {chargeResult.status === 'failed' && (
                    <div className="text-center space-y-4">
                        <div className="text-gray-700">ไม่สามารถทำรายการได้เนื่องจาก </div>
                        <div className="font-semibold text-xl">{chargeResult.failureMessage}</div>
                        <button
                            type="button"
                            onClick={handleClickButton}
                            className="p-2 rounded w-full text-white font-semibold bg-red-500"
                        >
                            ปิด
                        </button>
                    </div>
                )}
                {(chargeResult.status === 'pending' || chargeResult.status === 'successful') && (
                    <PaymentActivityInfo bookingCode={chargeResult?.bookingCode} />
                )}
            </ReactModal>
        )
    )
}
