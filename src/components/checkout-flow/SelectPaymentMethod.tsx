import { PaymentMethod, PaymentStep } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { useAxios } from '@/core/RootContext'
import Script from 'next/script'
import { useFormContext } from 'react-hook-form'

export const SelectPaymentMethod: React.VFC = () => {
    const {
        register,
        formState: { errors },
        watch,
    } = useFormContext()
    const { step, setPaymentStep } = usePaymentContext()
    const data = watch('paymentMethod', PaymentMethod.BANK_TRANSFER)
    const { post } = useAxios()

    const onClickPaid = () => {
        if (data === 'CREDIT_CARD') {
            window.OmiseCard.configure({
                publicKey: 'pkey_test_5q52539zzmb9psl4k9p',
            })
            window.OmiseCard.open({
                amount: 12345,
                currency: 'THB',
                defaultPaymentMethod: 'credit_card',
                onCreateTokenSuccess: async (nonce: string) => {
                    const isToken = nonce.startsWith('tokn_')
                    await post('/api/payment/charge', {
                        omiseToken: isToken ? nonce : null,
                        omiseSource: !isToken ? nonce : null,
                    })
                },
            })
        }
    }

    return step !== PaymentStep.SELECT_PAYMENT_METHOD ? null : (
        <>
            <Script type="text/javascript" src="https://cdn.omise.co/omise.js"></Script>
            <div className="p-4 rounded shadow-md border grid gap-y-4">
                <ul className="grid gap-y-4">
                    {Object.entries(PaymentMethod).map(([key, label], idx) => (
                        <li key={key} className="py-4 px-2 border border-gray-200 rounded flex flex-row space-x-2">
                            <input
                                id={key}
                                type="radio"
                                className="form-radio"
                                defaultChecked={idx === 0}
                                value={key}
                                {...register('paymentMethod', { required: true })}
                            />
                            <label htmlFor={key}>{label}</label>
                        </li>
                    ))}
                </ul>
                <small className="text-red-500">{errors.paymentMethod ? 'กรุณาเลือก' : ''}</small>
                <button
                    id={data}
                    type="button"
                    onClick={onClickPaid}
                    className="bg-indigo-500 rounded p-2  block w-full text-white"
                >
                    ชำระยอด {1000} บาท
                </button>
                <button
                    className="bg-transparent rounded p-2  block w-full text-indigo-500"
                    onClick={() => setPaymentStep(PaymentStep.INIT)}
                >{`< ย้อนกลับ`}</button>
            </div>
        </>
    )
}
