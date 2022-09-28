import { ErrorCode } from '@/constants'
import { useSignUp } from '@/core/SignupContext'
import { OTPError } from '@/exceptions/otp-error'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'

export const OTPForm: React.FC = () => {
    const { sentOtp, confirmOtp } = useSignUp()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<{ otp: string }>()
    const { push } = useRouter()

    const onSubmit: SubmitHandler<{ otp: string }> = async ({ otp }) => {
        try {
            await confirmOtp(otp)
            push('/')
        } catch (error) {
            if (error instanceof OTPError && error.code === ErrorCode.INVALID_OTP) {
                setError('otp', { message: 'กรุณาระบุเลข OTP  ให้ถูกต้อง' }, { shouldFocus: true })
            }
        }
    }

    if (!sentOtp) return null

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="otp">กรุณากรอกรหัส 6 หลักที่ได้รับจาก SMS</label>
            <input
                {...register('otp', { required: 'กรุณาระบุ', maxLength: 6 })}
                id="otp"
                type="text"
                className={`form-input ${!!errors.otp ? 'border border-red-500' : ''} rounded w-full`}
                pattern="[0-9]*"
                placeholder=""
                maxLength={6}
            ></input>
            <small className="text-red-500 ">{errors.otp?.message}</small>
            <button
                type="submit"
                className={`text-white ${
                    isSubmitting ? 'bg-indigo-700 opacity-20' : 'bg-indigo-700'
                }  p-2 rounded w-full mt-4`}
            >
                ยืนยัน
            </button>
        </form>
    )
}
