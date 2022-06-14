import { AddressListCard } from 'packages/web/src/components/checkout/AddressListCard'
import { BookingInfoCard } from 'packages/web/src/components/checkout/BookingInfoCard'
import { RegistrationSummary } from 'packages/web/src/components/checkout/RegistrationSummary'
import { usePaymentContext } from 'packages/web/src/core/PaymentContext'
import { PaymentStep } from 'packages/web/src/constants'
import { CourseModel } from 'packages/web/src/models/course/course.model'

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
