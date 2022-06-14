import { useSignUp } from 'packages/web/src/core/SignupContext'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'

export const OTPForm: React.VFC = () => {
    const { sentOtp, confirmOtp } = useSignUp()
    const { register, handleSubmit } = useForm()
    const router = useRouter()

    const onSubmit: SubmitHandler<{ otp: string }> = async ({ otp }) => {
        try {
            await confirmOtp(otp)
            router.replace('/')
        } catch (error) {
            console.error('cannot sent SMS')
        }
    }

    return (
        sentOtp && (
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="otp">กรุณากรอกรหัส 6 หลักที่ได้รับจาก SMS</label>
                <input
                    {...register('otp', { required: 'กรุณาระบุ', maxLength: 6 })}
                    id="otp"
                    type="text"
                    className="form-input"
                    pattern="[0-9]*"
                    placeholder=""
                    maxLength={6}
                ></input>
                <button type="submit" className="bg-yellow-500 p-2 rounded">
                    ยืนยัน
                </button>
            </form>
        )
    )
}
