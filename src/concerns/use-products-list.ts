import { useFirebase } from '@/core/RootContext'
import { ProductModel } from '@/models/ProductModel'
import { collection, getDocs, query, where } from 'firebase/firestore'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import Model from '@/models/Model'

export default function useProductsList() {
    const [productsList, setProductsList] = useState<ProductModel[]>([])
    const { db } = useFirebase()

    useEffect(() => {
        const productsRef = query(collection(db, 'products'), where('effectiveDate', '<=', new Date())).withConverter(
            Model.convert(ProductModel)
        )
        getDocs(productsRef).then(({ docs }) => {
            const results = docs.reduce((prev, item) => {
                const data = item.data()

                const notExpired = dayjs().isBefore(data.expiredDate, 'second')

                if (notExpired) {
                    prev.push(data)
                }

                return prev
            }, [])
            setProductsList(results)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return useMemo(() => productsList, [productsList])
}
