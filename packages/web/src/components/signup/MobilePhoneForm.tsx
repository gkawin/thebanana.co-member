import { useLoading } from '@/core/LoadingContext'
import { useSignUp } from '@/core/SignupContext'
import { mobileToThaiNumber } from '@thebanana-members/core/lib/utils'
import { SubmitHandler, useForm } from 'react-hook-form'

export const MobilePhoneForm: React.VFC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const { loading, loaded, isLoading } = useLoading()

    const { requestOtp, sentOtp } = useSignUp()

    const onSubmit: SubmitHandler<{ mobileNumber: string }> = async ({ mobileNumber }) => {
        loading()
        await requestOtp(mobileToThaiNumber(mobileNumber))
        loaded()
    }

    const disabled = isLoading || sentOtp

    return (
        <form className="flex flex-col justify-center " onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
                <label htmlFor="mobile-phone">เบอร์โทรศัพท์</label>
                <input
                    className={`form-input rounded ${errors?.mobileNumber ? 'border border-red-500' : ''}`}
                    type="text"
                    pattern="[0-9]*"
                    maxLength={10}
                    readOnly={disabled}
                    {...register('mobileNumber', { maxLength: 10, required: 'กรุณาระบุ' })}
                />
                <small className="text-red-500">{errors?.mobileNumber?.message}</small>
            </div>

            <button
                className={`${isLoading || sentOtp ? 'bg-yellow-500 opacity-20' : 'bg-yellow-500'} rounded p-2 my-2`}
                type="submit"
                disabled={disabled}
            >
                ขอรหัส OTP
            </button>
        </form>
    )
}
