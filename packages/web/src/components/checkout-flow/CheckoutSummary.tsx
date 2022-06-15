import { PaymentStep } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import { CourseModel } from '@thebanana/core/lib/models'
import { AddressListCard } from '../checkout/AddressListCard'
import { BookingInfoCard } from '../checkout/BookingInfoCard'
import { RegistrationSummary } from '../checkout/RegistrationSummary'

export type CheckoutSummaryProps = { product: CourseModel }

export const CheckoutSummary: React.VFC<CheckoutSummaryProps> = ({ product }) => {
    const { step } = usePaymentContext()
    if (step !== PaymentStep.INIT) return null

    return (
        <>
            <RegistrationSummary name={product.title} price={product.price} />
            <BookingInfoCard />
            <AddressListCard />
        </>
    )
}
