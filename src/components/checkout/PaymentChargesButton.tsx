import { PaymentStep } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { CourseModel } from '@/models/course/course.model'
import type { CheckoutFormField } from '@/pages/purchase/[slug]'
import { withPricing } from '@/utils/payment'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

export type PaymentChargesButtonProps = { product: CourseModel }

export const PaymentChargesButton: React.FC<PaymentChargesButtonProps> = ({ product }) => {
    const { step, setPaymentStep, createOmiseCharges, chargeResult } = usePaymentContext()
    const { handleSubmit } = useFormContext<CheckoutFormField>()
    const [loading, setLoading] = useState(false)

    const onClick = async (data: CheckoutFormField) => {
        setLoading(true)
        if (step === PaymentStep.INIT) {
            setPaymentStep(PaymentStep.SELECT_PAYMENT_METHOD)
        } else {
            createOmiseCharges(data, data.paymentMethod)
        }
    }

    useEffect(() => {
        if (chargeResult && loading) {
            setLoading(false)
        }
    }, [chargeResult, loading])

    return (
        <>
            <button
                disabled={loading || !!chargeResult}
                className="bg-indigo-700 rounded p-2 text-white"
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
