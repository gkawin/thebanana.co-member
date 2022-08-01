import { PaymentStep } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { CourseModel } from '@/models/course/course.model'
import type { CheckoutFormField } from '@/pages/purchase/[slug]'
import { withPricing } from '@/utils/payment'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export type PaymentChargesButtonProps = { product: CourseModel }

export const PaymentChargesButton: React.FC<PaymentChargesButtonProps> = ({ product }) => {
    const { step, setPaymentStep, createOmiseCharges, chargeResult, loading } = usePaymentContext()
    const { handleSubmit } = useFormContext<CheckoutFormField>()

    const onClick = async (data: CheckoutFormField) => {
        if (step === PaymentStep.INIT) {
            setPaymentStep(PaymentStep.SELECT_PAYMENT_METHOD)
        } else {
            createOmiseCharges(data, data.paymentMethod)
        }
    }

    return (
        <>
            <button
                disabled={loading}
                className={`rounded p-2 text-white ${loading ? 'bg-indigo-300' : 'bg-indigo-700'}`}
                type="button"
                onClick={handleSubmit(onClick)}
            >
                {step === PaymentStep.INIT && 'เลือกวิธีการชำระ'}
                {step === PaymentStep.SELECT_PAYMENT_METHOD && `ชำระ ${withPricing(product.price)}`}
            </button>
            {step !== PaymentStep.INIT && (
                <button
                    className="bg-transparent rounded p-2  block w-full text-indigo-500"
                    onClick={() => setPaymentStep(PaymentStep.INIT)}
                >
                    {`< ย้อนกลับ`}
                </button>
            )}
        </>
    )
}
