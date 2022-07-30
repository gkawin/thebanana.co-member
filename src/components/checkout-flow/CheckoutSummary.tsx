import { AddressListCard } from '@/components/checkout/AddressListCard'
import { BookingInfoCard } from '@/components/checkout/BookingInfoCard'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { usePaymentContext } from '@/core/PaymentContext'
import { PaymentStep } from '@/constants'
import { CourseModel } from '@/models/course/course.model'
import { PropsWithChildren } from 'react'

export const CheckoutSummary: React.FC<PropsWithChildren> = ({ children }) => {
    const { step } = usePaymentContext()

    if (step !== PaymentStep.INIT) return null

    return (
        <>
            {children}
            {/* <RegistrationSummary name={product.title} price={product.price} />
            <BookingInfoCard />
            <AddressListCard /> */}
        </>
    )
}
