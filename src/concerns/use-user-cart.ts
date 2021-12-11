import { useFirebase } from '@/core/RootContext'
import { BookingModel, BookingStatus } from '@/models/BookingModel'
import Model from '@/models/Model'
import { collection, onSnapshot, query, where } from '@firebase/firestore'
import { useEffect, useMemo, useState } from 'react'

export default function useUserCart() {
    const [items, setItems] = useState<BookingModel[]>([])
    const { db, auth } = useFirebase()

    useEffect(() => {
        if (!auth.currentUser.uid) return () => {}

        const q = query(collection(db, 'booking'), where('userId', '==', auth.currentUser.uid)).withConverter(
            Model.convert(BookingModel)
        )

        const unsubscribe = onSnapshot(q, (ss) => {
            const results = ss.docs.map((doc) => {
                return doc.data()
            })
            setItems(results)
        })

        return () => {
            unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const waitingForPaymentList = useMemo(
        () => items.filter((item) => item.status === BookingStatus.WAITING_FOR_PAYMENT),
        [items]
    )

    return {
        items,
        categories: {
            [BookingStatus.WAITING_FOR_PAYMENT]: waitingForPaymentList,
        },
    }
}
