import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { useFirebase } from '@/core/RootContext'
import dayjs from 'dayjs'
import { ProductsModel } from '@/models/products.model'

export const SelectSubjectForm: React.VFC<{ onSelected: Function }> = ({ onSelected }) => {
    const [productId, setProductId] = useState('')
    const [products, setProducts] = useState([])
    const { db } = useFirebase()

    const handleToggleClick = (id: string) => (e: React.SyntheticEvent) => {
        e.preventDefault()
        setProductId(id)
        onSelected(id)
    }

    useEffect(() => {
        const productsRef = query(collection(db, 'products'), where('effectiveDate', '<=', new Date()))
        getDocs(productsRef).then(({ docs }) => {
            const results = docs.reduce((prev, item) => {
                const data = item.data()
                const notExpired = dayjs().isBefore(data.expiredDate.toDate(), 'second')

                if (notExpired) {
                    prev.push(data as any)
                }

                return prev
            }, [] as ProductsModel[])
            setProducts(results)
        })
    }, [db])

    return (
        <section className="py-4">
            <h2 className="pt-4 text-lg">เลือกวิชา</h2>
            <div className="grid grid-flow-row gap-y-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={handleToggleClick(product.id)}
                        className={`border-2 border-indigo-500 cursor-pointer rounded p-2 text-center w-full transition-all duration-400 ease-in-out ${
                            product.id === productId ? 'bg-indigo-500 text-white' : 'bg-white'
                        }`}
                    >
                        {product.name}
                    </div>
                ))}
            </div>
        </section>
    )
}
