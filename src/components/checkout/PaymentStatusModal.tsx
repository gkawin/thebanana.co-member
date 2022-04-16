import useMyBooking from '@/concerns/use-my-booking'
import { BookingGroup, BookingStatus, PaymentMethod } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { ChargeResultModel } from '@/models/payment/ChargeResult.model'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'

type PaymentActivityInfoProps = {
    bookingCode: string
    paymentMethod: PaymentMethod
    qrImage?: string
    status: ChargeResultModel['status']
}

const PaymentActivityInfo: React.VFC<PaymentActivityInfoProps> = ({ bookingCode, status, paymentMethod, qrImage }) => {
    const { items: upCommingList } = useMyBooking({ bookingCode, bookingGroup: BookingGroup.UpComming })

    const upCommingClass = upCommingList[0]
    const isPromptPay = paymentMethod === PaymentMethod.PROMPT_PAY

    if (!upCommingClass) {
        if (isPromptPay && status === 'pending') {
            return (
                <div className="relative">
                    <span className="font-thin block">กรุณาทำรายการผ่าน app ธนาคาร</span>
                    <Image unoptimized src={qrImage} alt="qr_code" layout="intrinsic" width={300} height={300} />
                </div>
            )
        }
    }

    console.log(upCommingClass)
    return (
        <div className="text-center space-y-4">
            <div className="text-sm">หมายเลขการจอง</div>
            <div className="text-2xl font-semibold">{upCommingClass?.bookingCode}</div>
            <span className="text-xs text-gray-500">กรุณาบันทึกหมายเลขการจองนี้ไว้เพื่อตรวจสอบ</span>
        </div>
    )
}

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
        <ReactModal
            isOpen={isOpen}
            className=" p-4 bg-white m-auto w-10/12 border border-gray-200 rounded transform translate-y-8"
        >
            <div className="flex flex-col space-y-4">
                <PaymentActivityInfo
                    bookingCode={chargeResult?.bookingCode}
                    paymentMethod={chargeResult?.paymentMethod}
                    qrImage={chargeResult?.qrCode?.download_uri}
                    status={chargeResult?.status}
                />
                <button
                    type="button"
                    onClick={handleClickButton}
                    className="p-2 rounded text-white font-semibold bg-indigo-500"
                >
                    ปิด
                </button>
            </div>
        </ReactModal>
    )
}
