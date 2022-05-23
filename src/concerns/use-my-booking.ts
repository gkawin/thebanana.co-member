import { BookingGroup, BookingStatus, FailureCode, PaymentMethod } from '@/constants'
import { useFirebase } from '@/core/RootContext'
import { BookingModel } from '@/models/BookingModel'
import { CourseModel } from '@/models/course/course.model'
import Model from '@/models/Model'
import { UserAddressModel } from '@/models/UserAddressModel'
import { withPricing } from '@/utils/payment'
import {
    collection,
    doc,
    DocumentReference,
    getDoc,
    onSnapshot,
    query,
    QueryConstraint,
    where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

export type BookingInfo = {
    billingId: string
    bookingCode: string
    startDate: string
    endDate: string
    pricing: string
    status: BookingStatus
    userId: string
    productName: string
    shippingAddress: string
    paymentMethod: PaymentMethod
    failureCode: FailureCode
}

export default function useMyBooking(options?: { bookingCode?: string; bookingGroup?: BookingGroup }) {
    const [items, setItems] = useState<BookingInfo[]>([])
    const { db, auth } = useFirebase()
    const [bookingGroup, setBookingGroup] = useState<BookingGroup>(options?.bookingGroup ?? BookingGroup.UpComming)

    const queryBooinkGroupCondition = () => {
        const bookingCode = options?.bookingCode ?? null

        let queries: QueryConstraint[] = []

        if (bookingCode) {
            queries.push(where('bookingCode', '==', bookingCode))
        } else {
            switch (bookingGroup) {
                case BookingGroup.UpComming:
                    queries = [
                        where('status', 'in', [BookingStatus.PAID, BookingStatus.PENDING]),
                        where('endDate', '>=', new Date()),
                    ]
                    break
                case BookingGroup.Past:
                    queries = [where('status', 'in', [BookingStatus.PAID]), where('endDate', '<', new Date())]
                    break
                case BookingGroup.Cancelled:
                    queries = [where('status', 'in', [BookingStatus.REJECTED, BookingStatus.CANCELLED])]
                    break
            }
        }

        return queries
    }

    useEffect(() => {
        if (!auth.currentUser.uid) return () => {}

        const q = query(
            collection(db, 'booking'),
            ...[where('user', '==', doc(db, 'users', auth.currentUser.uid)), ...queryBooinkGroupCondition()]
        ).withConverter(Model.convert(BookingModel))

        const unsubscribe = onSnapshot(q, async (ss) => {
            const results = await Promise.all(
                ss.docs
                    .map<Promise<any>>(async (doc) => {
                        if (!doc.exists()) return null
                        const props = doc.data()
                        const product = (await getDoc(props.course as DocumentReference<CourseModel>)).data()
                        const address = (
                            await getDoc(props.shippingAddress as DocumentReference<UserAddressModel>)
                        ).data()

                        return {
                            billingId: props.billingId,
                            bookingCode: props.bookingCode,
                            startDate: props.startDate.toISOString(),
                            endDate: props.endDate.toISOString(),
                            pricing: withPricing(props.price),
                            status: props.status,
                            userId: props.user.id,
                            productName: product.title,
                            shippingAddress: address && address.address,
                            paymentMethod: props.paymentMethod,
                            failureCode: props.failureCode,
                        }
                    })
                    .filter(Boolean)
            )
            setItems(results)
        })

        return () => {
            console.log('unsubsceribe')
            unsubscribe()
        }
        // NOTE: only booking Group has been changed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingGroup])

    return { setBookingGroup, items, bookingGroup }
}
