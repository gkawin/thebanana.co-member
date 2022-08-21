import useMyBooking from '@/concerns/use-my-booking'
import { BookingStatus, PaymentMethod } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { SpinLoading } from '../portal/SpinLoading'

type PaymentActivityInfoProps = {
    bookingCode: string
    qrImage?: string
}

const PaymentActivityInfo: React.FC<PaymentActivityInfoProps> = ({ bookingCode, qrImage }) => {
    const { items: bookingList } = useMyBooking({ bookingCode })

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
                <span className="text-gray-700">กรุณาทำรายการผ่าน app ธนาคาร</span>
                <div className="relative">
                    <Image unoptimized src={qrImage} alt="qr_code" layout="intrinsic" width={300} height={300} />
                </div>
                <span className="text-red-600 text-sm font-semibold">
                    กรุณาอย่าปิดหน้าจนกว่าจะทำรายการชำระผ่าน QR Code สำเร็จ
                </span>
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
                    <PaymentActivityInfo
                        bookingCode={chargeResult?.bookingCode}
                        qrImage={chargeResult?.qrCode?.download_uri}
                    />
                )}
            </ReactModal>
        )
    )
}
