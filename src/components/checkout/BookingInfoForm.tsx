import { DatasetType } from '@/constants'
import { useUserInfoContext } from '@/core/RootContext'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export type BookingInfoFormProps = any

export const BookingInfoForm: React.VFC<BookingInfoFormProps> = () => {
    const { personal, schools } = useUserInfoContext()
    const {
        register,
        watch,
        setValue,
        resetField,
        formState: { errors },
    } = useFormContext()

    const datasetType = watch('datasetType', DatasetType.EXISITING)
    useEffect(() => {
        if (datasetType === DatasetType.EXISITING) {
            setValue('studentName', personal?.fullname ?? '')
            setValue('nickname', personal?.nickname ?? '')
            setValue('school', schools[0]?.school)
        } else {
            resetField('studentName')
            resetField('nickname')
            resetField('school')
        }
    }, [datasetType, personal, resetField, schools, setValue])

    const isReadonly = datasetType === DatasetType.EXISITING
    return (
        <>
            <div className="py-2">
                <span>
                    <input
                        id="dataset_existing"
                        className="form-radio"
                        type="radio"
                        value={DatasetType.EXISITING}
                        defaultChecked
                        {...register('datasetType', { required: 'กรุณาเลือก' })}
                    />
                    <label htmlFor="dataset_existing" className="ml-4">
                        เลือกข้อมูลที่มีอยู่แล้ว
                    </label>
                </span>
                <span className="ml-4">
                    <input
                        id="dataset_new"
                        className="form-radio"
                        type="radio"
                        value={DatasetType.CREATED_NEW}
                        {...register('datasetType', { required: 'กรุณาเลือก' })}
                    />
                    <label htmlFor="dataset_new" className="ml-4">
                        กรอกข้อมูลใหม่
                    </label>
                </span>
            </div>
            <label htmlFor="studentName">ชื่อผู้เรียน</label>
            <input
                type="text"
                className={`form-input rounded ${isReadonly ? 'bg-gray-200' : 'bg-transparent'}`}
                id="studentName"
                readOnly={isReadonly}
                {...register('studentName', { required: 'กรุณาระบุ' })}
            />
            <small className="text-red-500 mb-2">{errors.studentName?.message}</small>

            <label htmlFor="nickname">ชื่อเล่น</label>
            <input
                type="text"
                className={`form-input rounded ${isReadonly ? 'bg-gray-200' : 'bg-transparent'}`}
                id="nickname"
                readOnly={isReadonly}
                {...register('nickname', { required: 'กรุณาระบุ' })}
            />
            <small className="text-red-500 mb-2">{errors.nickname?.message}</small>

            <label htmlFor="school">โรงเรียน</label>
            <input
                type="text"
                className={`form-input rounded ${isReadonly ? 'bg-gray-200' : 'bg-transparent'}`}
                id="school"
                readOnly={isReadonly}
                {...register('school', { required: 'กรุณาระบุ' })}
            />
            <small className="text-red-500 mb-2">{errors.school?.message}</small>
        </>
    )
}
