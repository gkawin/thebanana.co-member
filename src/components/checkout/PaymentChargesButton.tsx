import { PaymentMethod, PaymentStep } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { ProductModel } from '@/models/ProductModel'
import type { CheckoutFormField } from '@/pages/purchase/[slug]'
import { withPricing } from '@/utils/payment'
import { useFormContext } from 'react-hook-form'

export type PaymentChargesButtonProps = { product: ProductModel }
export const PaymentChargesButton: React.VFC<PaymentChargesButtonProps> = ({ product }) => {
    const { step, setPaymentStep, createOmiseCharges } = usePaymentContext()
    const { handleSubmit } = useFormContext<CheckoutFormField>()

    const onClick = async (data: CheckoutFormField) => {
        if (step === PaymentStep.INIT) {
            setPaymentStep(PaymentStep.SELECT_PAYMENT_METHOD)
        } else {
            if (data.paymentMethod === PaymentMethod[PaymentMethod.CREDIT_CARD]) {
                createOmiseCharges(product)
            }
        }
    }

    return (
        <>
            <button className="bg-indigo-500 rounded p-2 text-white" type="button" onClick={handleSubmit(onClick)}>
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
