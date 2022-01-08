import { useFirebase } from '@/core/RootContext'
import { BookingModel, BookingStatus } from '@/models/BookingModel'
import Model from '@/models/Model'
import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer'
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'

export type UseUserHistories = {
    items: BookingModel[]
    category: Record<keyof typeof BookingStatus, BookingModel[]>
}

export default function useUserHistories() {
    const [items, setItems] = useState(null)
    const { db, auth } = useFirebase()

    useEffect(() => {
        if (!auth.currentUser.uid) return () => {}

        const q = query(
            collection(db, 'booking'),
            where('user', '==', doc(db, 'users', auth.currentUser.uid))
        ).withConverter(Model.convert(BookingModel))

        const unsubscribe = onSnapshot(q, async (ss) => {
            const results = await Promise.all(
                ss.docs.map(async (doc) => {
                    if (!doc.exists()) return null
                    const { getUser, getProduct, ...props } = doc.data()
                    const user = await getUser()
                    const product = await getProduct()

                    return {
                        ...props,
                        user,
                        product,
                    }
                })
            )

            setItems(results)
        })

        return () => {
            unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const itemList = useMemo(() => {
        return {
            total: items?.length ?? 0,
            [BookingStatus.WAITING_FOR_PAYMENT]: (items || []).filter(
                (item) => item.status === BookingStatus.WAITING_FOR_PAYMENT
            ),
        }
    }, [items])

    return itemList
}
