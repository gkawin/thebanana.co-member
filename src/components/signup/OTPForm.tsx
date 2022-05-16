import { useAxios } from '@/core/RootContext'
import { useRecaptchaContext } from '@/pages/signup'
import { SubmitHandler, useForm } from 'react-hook-form'

export const OTPForm: React.VFC = () => {
    const { confirmationResult } = useRecaptchaContext()
    const { register, handleSubmit } = useForm()
    const axios = useAxios()

    const onSubmit: SubmitHandler<{ otp: string }> = async ({ otp }) => {
        try {
            await confirmationResult.confirm(otp)
            axios.post('/user')
        } catch (error) {
            console.error('cannot sent SMS')
        }
    }

    return (
        confirmationResult && (
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
