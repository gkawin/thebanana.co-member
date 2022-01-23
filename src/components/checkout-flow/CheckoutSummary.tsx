import { ProductModel } from '@/models/ProductModel'
import { AddressListCard } from '@/components/checkout/AddressListCard'
import { BookingInfoCard } from '@/components/checkout/BookingInfoCard'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { usePaymentContext } from '@/core/PaymentContext'
import { PaymentStep } from '@/constants'

export type CheckoutSummaryProps = { product: ProductModel }

export const CheckoutSummary: React.VFC<CheckoutSummaryProps> = ({ product }) => {
    const { step } = usePaymentContext()
    if (step !== PaymentStep.INIT) return null

    return (
        <>
            <RegistrationSummary name={product.name} price={product.price} />
            <BookingInfoCard />
            <AddressListCard />
        </>
    )
}
