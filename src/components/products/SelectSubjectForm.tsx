import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { useFirebase } from '@/core/RootContext'
import dayjs from 'dayjs'
import { ProductModel } from '@/models/ProductModel'
import Model from '@/models/Model'

export const SelectSubjectForm: React.VFC = ({}) => {
    const [productInfo, setProductInfo] = useState<ProductModel>(null)
    const [products, setProducts] = useState<ProductModel[]>([])
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
            setProducts(results)
        })
    }, [db])

    return (
        <>
            <section className="py-4">
                <h2 className="pt-4 text-lg">เลือกวิชา</h2>
                <div className="grid grid-flow-row gap-y-4">
                    {products.map((product) => (
                        <div
                            key={product.code}
                            onClick={() => setProductInfo(product)}
                            className={`border-2 border-indigo-500 cursor-pointer rounded p-2 text-center w-full transition-all duration-400 ease-in-out ${
                                product.code === productInfo?.code ? 'bg-indigo-500 text-white' : 'bg-white'
                            }`}
                        >
                            {product.name}
                        </div>
                    ))}
                </div>
            </section>
            {productInfo && (
                <section className="py-4">
                    <h2 className="text-xl font-semibold">สรุปรายการลงทะเบียน</h2>
                    <div className="grid grid-flow-row">
                        <div>คอร์สเรียน</div>
                        <div>{productInfo.name}</div>
                        <div>ราคา</div>
                        <div>{productInfo.pricing}</div>
                    </div>
                </section>
            )}
        </>
    )
}
