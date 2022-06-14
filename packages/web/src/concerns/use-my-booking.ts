import { BookingGroup, BookingStatus, FailureCode, PaymentMethod } from 'packages/web/src/constants'
import { useUser } from 'packages/web/src/core/RootContext'
import { BookingModel, ReceiptModel } from 'packages/web/src/models/BookingModel'
import { CourseModel } from 'packages/web/src/models/course/course.model'
import Model from 'packages/web/src/models/Model'
import { UserAddressModel } from 'packages/web/src/models/UserAddressModel'
import { withPricing } from 'packages/web/src/utils/payment'
import {
    doc,
    DocumentReference,
    getDoc,
    onSnapshot,
    query,
    QueryConstraint,
    where,
    getFirestore,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { bookingCollection } from './query'

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
    receipt?: ReceiptModel
}

export default function useMyBooking(options?: { bookingCode?: string; bookingGroup?: BookingGroup }) {
    const [items, setItems] = useState<BookingInfo[]>([])
    const db = getFirestore()
    const { uid } = useUser()
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
        if (!uid) return () => {}

        const q = query(
            bookingCollection(db),
            ...[where('user', '==', doc(db, 'users', uid)), ...queryBooinkGroupCondition()]
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
                            receipt: props.receipt,
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
    }, [bookingGroup, uid])

    return { setBookingGroup, items, bookingGroup }
}
