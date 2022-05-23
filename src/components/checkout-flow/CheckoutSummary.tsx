import { AddressListCard } from '@/components/checkout/AddressListCard'
import { BookingInfoCard } from '@/components/checkout/BookingInfoCard'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { usePaymentContext } from '@/core/PaymentContext'
import { PaymentStep } from '@/constants'
import { CourseModel } from '@/models/course/course.model'

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
