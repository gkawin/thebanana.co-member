import { BookingGroup, BookingStatus } from '@/constants'
import { useUserInfo } from '@/core/RootContext'
import { BookingModel } from '@/models/BookingModel'
import { CourseModel } from '@/models/course/course.model'
import Model from '@/models/Model'
import { UserAddressModel } from '@/models/UserAddressModel'
import { withPricing } from '@/utils/payment'
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

export type PickBookingInfoFromApi = Pick<
    BookingModel,
    | 'startDate'
    | 'endDate'
    | 'bookingCode'
    | 'billingId'
    | 'receipt'
    | 'status'
    | 'paymentMethod'
    | 'studentInfo'
    | 'promptPayInfo'
>
export interface UseMyBookingInfo extends PickBookingInfoFromApi {
    shippingAddress: string
    pricing: string
    productName: string
}

export default function useMyBooking(options?: { bookingCode?: string; bookingGroup?: BookingGroup }) {
    const [items, setItems] = useState<UseMyBookingInfo[]>([])
    const db = getFirestore()
    const { uid } = useUserInfo()
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
            const createdListBookings = ss.docs.map<Promise<UseMyBookingInfo>>(async (doc) => {
                if (!doc.exists()) return null

                const { course: CourseRef, user: UserRef, shippingAddress: AddrRef, ...props } = doc.data()

                const [course, shippingAddress] = await Promise.all([
                    (
                        await getDoc(
                            CourseRef.withConverter(
                                Model.convert(CourseModel) as null
                            ) as DocumentReference<CourseModel>
                        )
                    ).data(),
                    (
                        await getDoc(
                            AddrRef.withConverter(
                                Model.convert(UserAddressModel) as null
                            ) as DocumentReference<UserAddressModel>
                        )
                    ).data(),
                ])

                return {
                    billingId: props.billingId,
                    pricing: withPricing(props.price),
                    bookingCode: props.bookingCode,
                    endDate: props.endDate,
                    startDate: props.startDate,
                    productName: course.title,
                    shippingAddress: shippingAddress.address,
                    studentInfo: props.studentInfo,
                    receipt: props.receipt,
                    paymentMethod: props.paymentMethod,
                    status: props.status,
                    promptPayInfo: props?.promptPayInfo,
                }
            })
            const results = await Promise.all(createdListBookings)
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
