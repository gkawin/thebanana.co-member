import { BookingGroup, BookingStatus } from '@/constants'
import { useFirebase } from '@/core/RootContext'
import { BookingModel } from '@/models/BookingModel'
import Model from '@/models/Model'
import { ProductModel } from '@/models/ProductModel'
import { withPricing } from '@/utils/payment'
import { collection, doc, DocumentReference, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function useMyBooking() {
    const [items, setItems] = useState([])
    const { db, auth } = useFirebase()
    const [bookingGroup, setBookingGroup] = useState<BookingGroup>(BookingGroup.UpComming)

    const queryBooinkGroupCondition = () => {
        switch (bookingGroup) {
            case BookingGroup.UpComming:
                return [
                    where('status', 'in', [BookingStatus.PAID, BookingStatus.CREATED]),
                    where('endDate', '>=', new Date()),
                ]
            case BookingGroup.Past:
                return [
                    where('status', 'in', [BookingStatus.PAID, BookingStatus.CREATED]),
                    where('endDate', '<', new Date()),
                ]
            case BookingGroup.Cancelled:
                return [where('status', 'in', [BookingStatus.REJECTED, BookingStatus.CANCELLED])]
            default:
                return []
        }
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
                        const product = (await getDoc(props.product as DocumentReference<ProductModel>)).data()

                        return {
                            billingId: props.billingId,
                            startDate: props.startDate.toISOString(),
                            endDate: props.endDate.toISOString(),
                            pricing: withPricing(props.price),
                            status: props.status,
                            userId: props.user.id,
                            productName: product.name,
                        }
                    })
                    .filter(Boolean)
            )
            setItems(results)
        })

        return () => {
            unsubscribe()
        }
        // NOTE: only booking Group has been changed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingGroup])

    return { setBookingGroup, items, bookingGroup }
}
