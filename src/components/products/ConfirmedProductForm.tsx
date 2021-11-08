import { ProductModel } from '@/models/ProductModel'
import { useAxios, useFirebase } from '@/core/RootContext'
import React from 'react'
import { useRouter } from 'next/dist/client/router'
import { collection, doc, setDoc } from '@firebase/firestore'
import Model from '@/models/Model'
import { BookingModel, BookingStatus } from '@/models/BookingModel'
import dayjs from 'dayjs'

export type ConfirmedProductFormProps = {
    productInfo: ProductModel
}

export const ConfirmedProductForm: React.VFC<ConfirmedProductFormProps> = ({ productInfo }) => {
    const { db, auth } = useFirebase()
    const router = useRouter()

    const handleOnSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        await setDoc(doc(collection(db, 'booking')).withConverter(Model.convert(BookingModel)), {
            createdOn: new Date(),
            productId: doc(db, 'products', productInfo.id).path,
            status: BookingStatus.WAITING_FOR_PAYMENT,
            expiredOn: dayjs().add(10, 'day').toDate(),
            userId: doc(db, 'users', auth.currentUser.uid).path,
        })
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
