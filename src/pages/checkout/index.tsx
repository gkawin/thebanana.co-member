import { NextPage } from 'next'
import Link from 'next/link'
import { BookingStatus } from '@/models/BookingModel'
import useUserHistories from '@/concerns/use-user-histories'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { BookingInfoForm, CheckoutFormField } from '@/components/checkout/BookingInfoForm'

const CheckoutPage: NextPage = () => {
    const histories = useUserHistories()

    const onCheckout = async (data: CheckoutFormField) => {
        console.log(data)
    }

    return (
        <div className="p-4">
            <h2 className="text-sub-title font-semibold">สรุปรายการลงทะเบียน</h2>
            {histories.category[BookingStatus.WAITING_FOR_PAYMENT].length > 0 && (
                <>
                    <RegistrationSummary />
                    <BookingInfoForm onSubmit={onCheckout} />
                </>
            )}
            {histories.category[BookingStatus.WAITING_FOR_PAYMENT].length === 0 && (
                <div className="block">
                    ไม่มีวิชาที่คุณเลือกลงทะเบียนอยู่
                    <Link href="/">
                        <a className="text-indigo-500 text-center">กลับหน้าหลัก</a>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CheckoutPage
