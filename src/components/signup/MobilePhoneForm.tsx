import { useRecaptchaContext } from '@/pages/signup'
import { mobileToThaiNumber } from '@/utils/phone-number'
import { SubmitHandler, useForm } from 'react-hook-form'

export const MobilePhoneForm: React.VFC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const { requestOtp } = useRecaptchaContext()

    const onSubmit: SubmitHandler<{ mobileNumber: string }> = async ({ mobileNumber }) => {
        requestOtp(mobileToThaiNumber(mobileNumber))
    }

    return (
        <form className="flex flex-col justify-center " onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <label htmlFor="mobile-phone">เบอร์โทรศัพท์</label>
                <input
                    className={`form-input rounded ${errors?.mobileNumber ? 'border border-red-500' : ''}`}
                    type="text"
                    pattern="[0-9]*"
                    maxLength={10}
                    {...register('mobileNumber', { maxLength: 10, required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500">{errors?.mobileNumber?.message}</small>
            </div>

            <button className={`${true ? 'bg-yellow-500 opacity-20' : 'bg-yellow-500'} rounded p-4 my-2`} type="submit">
                ขอรหัส OTP
            </button>
        </form>
    )
}
