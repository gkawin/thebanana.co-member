import { DatasetType } from '@/constants'
import { useUserInfo } from '@/core/RootContext'
import type { PaymentChargeBodyModel } from '@/models/payment/PaymentChargeBody.model'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export const BookingInfoCard: React.FC = () => {
    const {
        personal: { fullname, nickname },
        schools,
    } = useUserInfo()

    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext<PaymentChargeBodyModel>()

    useEffect(() => {
        setValue('studentName', fullname ?? '')
        setValue('nickname', nickname ?? '')
        setValue('school', schools[0]?.school)
        setValue('datasetType', DatasetType.CREATED_NEW)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullname, nickname, schools])

    return (
        <div className="p-4 rounded shadow-md border flex flex-col">
            <h2 className="text-2xl font-semibold">รายละเอียดผู้เรียน</h2>

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
    )
}
