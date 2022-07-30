import { usePaymentContext } from '@/core/PaymentContext'
import { PaymentStep } from '@/constants'

import { BookingInfoCard } from '../checkout/BookingInfoCard'
import { AddressListCard } from '../checkout/AddressListCard'
import { RegistrationSummary } from '../checkout/RegistrationSummary'
import type { CourseModel } from '@/models/course/course.model'

export const CheckoutSummary: React.FC<{ course: CourseModel }> = ({ course }) => {
    const { step } = usePaymentContext()

    if (step !== PaymentStep.INIT) return null

    return (
        <>
            <RegistrationSummary name={course.title} price={course.price} />
            <BookingInfoCard />
            <AddressListCard />
        </>
    )
}
