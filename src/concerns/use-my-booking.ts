import { useFirebase } from '@/core/RootContext'
import { BookingModel } from '@/models/BookingModel'
import Model from '@/models/Model'
import { ProductModel } from '@/models/ProductModel'
import { collection, doc, getDoc, onSnapshot, query, where, DocumentReference } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'

export type UseMyBooking = Pick<BookingModel, 'bookingCode' | 'billingId' | 'expiredOn' | 'status'> & {
    product: ProductModel
    userId: string
}

export default function useMyBooking() {
    const [items, setItems] = useState<UseMyBooking[]>([])
    const { db, auth } = useFirebase()

    useEffect(() => {
        if (!auth.currentUser.uid) return () => {}

        const q = query(
            collection(db, 'booking'),
            where('user', '==', doc(db, 'users', auth.currentUser.uid))
        ).withConverter(Model.convert(BookingModel))

        const unsubscribe = onSnapshot(q, async (ss) => {
            const results = await Promise.all(
                ss.docs.map<Promise<UseMyBooking>>(async (doc) => {
                    if (!doc.exists()) return null
                    const props = doc.data()
                    return {
                        billingId: props.billingId,
                        bookingCode: props.bookingCode,
                        expiredOn: props.expiredOn,
                        status: props.status,
                        userId: props.user.id,
                        product: (await getDoc(props.product as DocumentReference<ProductModel>)).data(),
                    }
                })
            )
            setItems(results)
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return useMemo(() => items, [items])
}
