import { ProductModel } from '@/models/ProductModel'
import { useAxios, useFirebase } from '@/core/RootContext'
import React from 'react'
import { useRouter } from 'next/dist/client/router'

export type ConfirmedProductFormProps = {
    productInfo: ProductModel
}

export const ConfirmedProductForm: React.VFC<ConfirmedProductFormProps> = ({ productInfo }) => {
    const { auth } = useFirebase()
    const axios = useAxios()
    const router = useRouter()

    const handleOnSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        await axios.post('/api/enrollment', { productId: productInfo.id, userId: auth.currentUser.uid })
        router.push('/checkout')
    }

    if (!productInfo) return null

    return (
        <form onSubmit={handleOnSubmit}>
            <section className="py-4">
                <h2 className="text-xl font-semibold">สรุปรายการลงทะเบียน</h2>
                <div className="grid grid-flow-row">
                    <div>คอร์สเรียน</div>
                    <div>{productInfo.name}</div>
                    <div>ราคา</div>
                    <div>{productInfo.pricing}</div>
                </div>
            </section>

            <button type="submit" className="p-2 bg-yellow-400  w-full rounded">
                จองคอร์สเรียน
            </button>
        </form>
    )
}
