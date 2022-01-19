import { ProductModel } from '@/models/ProductModel'
import { AddressListCard } from '@/components/checkout/AddressListCard'
import { BookingInfoCard } from '@/components/checkout/BookingInfoCard'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { usePaymentContext } from '@/core/PaymentContext'
import { PaymentStep } from '@/constants'

export type CheckoutSummaryProps = { product: ProductModel }

export const CheckoutSummary: React.VFC<CheckoutSummaryProps> = ({ product }) => {
    const { step, setPaymentStep } = usePaymentContext()

    return step !== PaymentStep.INIT ? null : (
        <>
            <RegistrationSummary name={product.name} price={product.price} />
            <BookingInfoCard />
            <AddressListCard />
            <button
                type="button"
                onClick={() => setPaymentStep(PaymentStep.SELECT_PAYMENT_METHOD)}
                className="bg-indigo-500 rounded p-2 my-2 block w-full text-white"
            >
                ถัดไป
            </button>
        </>
    )
}
