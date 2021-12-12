import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { AddressForm } from '@/components/checkout/AddressForm'
import { BookingStatus } from '@/models/BookingModel'
import useUserHistories from '@/concerns/use-user-histories'
import { useFirebase } from '@/core/RootContext'
import useUserInfo from '@/concerns/use-user-info'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'

export type CheckoutFormProps = {
    studentName: string
    school: string
    nickname: string
}

const CheckoutPage: NextPage = () => {
    const { auth } = useFirebase()
    const { getSchoolList } = useUserInfo()
    const histories = useUserHistories()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<CheckoutFormProps>()

    const onCheckout = async (data) => {
        console.log(data)
    }

    const renderForm = () => (
        <form onSubmit={handleSubmit(onCheckout)} className="grid gap-y-4">
            <RegistrationSummary />
            <h2 className="text-2xl font-semibold">รายละเอียดผู้เรียน</h2>
            <div className="p-4 rounded shadow-md border flex flex-col">
                <label htmlFor="studentName">ชื่อผู้เรียน</label>
                <input
                    type="text"
                    className="form-input rounded"
                    id="studentName"
                    {...register('studentName', { required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500 mb-2">{errors.studentName?.message}</small>

                <label htmlFor="nickname">ชื่อเล่น</label>
                <input
                    type="text"
                    className="form-input rounded"
                    id="nickname"
                    {...register('nickname', { required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500 mb-2">{errors.nickname?.message}</small>

                <label htmlFor="school">โรงเรียน</label>
                <input
                    type="text"
                    className="form-input rounded"
                    id="school"
                    {...register('school', { required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500 mb-2">{errors.school?.message}</small>
            </div>

            <AddressForm />

            <button type="submit" className="bg-indigo-500 rounded p-2 my-2 block w-full text-white">
                ชำระเงิน
            </button>
        </form>
    )

    return (
        <div className="p-4">
            <h2 className="text-sub-title font-semibold">สรุปรายการลงทะเบียน</h2>
            {histories.category[BookingStatus.WAITING_FOR_PAYMENT].length > 0 && renderForm()}
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
