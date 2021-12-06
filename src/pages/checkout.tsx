import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { AddressForm } from '@/components/checkout/AddressForm'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from '@firebase/firestore'
import { useFirebase } from '@/core/RootContext'
import Model from '@/models/Model'
import { BookingModel, BookingStatus } from '@/models/BookingModel'
import { CheckoutModel } from '@/models/CheckoutModel'
import { ProductModel } from '@/models/ProductModel'
import { plainToClass } from 'class-transformer'

export type CheckoutFormProps = {
    productId: string
    address: string
    userId: string
}

const CheckoutPage: NextPage = () => {
    const { handleSubmit } = useForm<CheckoutFormProps>()
    const [bookingList, setBookingList] = useState<CheckoutModel[]>([])
    const { db, auth } = useFirebase()

    const onCheckout = async () => {
        console.log()
    }

    useEffect(() => {
        const bookingCol = collection(db, 'booking')
        const waitingForPaymentQuery = query(
            bookingCol,
            where('status', '==', BookingStatus.WAITING_FOR_PAYMENT),
            where('userPath', '==', `users/${auth.currentUser.uid}`),
            where('expiredOn', '>=', new Date()),
            orderBy('expiredOn', 'desc')
        ).withConverter(Model.convert(BookingModel))

        getDocs(waitingForPaymentQuery)
            .then((result) => result.docs.map((v) => v.data()))
            .then(async (bookinglist) => {
                const createdBookinglist = bookinglist.map(async ({ productPath, ...props }) => {
                    const product = (
                        await getDoc(doc(db, productPath).withConverter(Model.convert(ProductModel)))
                    ).data()
                    return { ...props, product }
                })
                const results = await Promise.all(createdBookinglist)
                return plainToClass(CheckoutModel, results)
            })
            .then((result) => {
                setBookingList(result)
            })
    }, [auth.currentUser.uid, db])

    const renderForm = () => (
        <form onSubmit={handleSubmit(onCheckout)}>
            <div className="py-4 divide-y gap-y-4 grid">
                {bookingList.map((booking) => (
                    <div key={Math.random().toString()} className="grid grid-flow-row">
                        <div>คอร์สเรียน</div>
                        <div className="text-gray-500 font-light">{booking.product.name}</div>
                        <div>ราคา</div>
                        <div>{booking.product.pricing}</div>
                        <div className="flex flex-co`1">
                            <label htmlFor="enrollName">ชื่อนักเรียน</label>
                            <input id="enrollName" className="form-input rounded" type="text"></input>
                        </div>
                    </div>
                ))}
            </div>
            <AddressForm />
            <button type="submit" className="bg-indigo-500 rounded p-2 my-2 block w-full text-white">
                ชำระเงิน
            </button>
        </form>
    )

    return (
        <div className="p-4">
            <h2 className="text-sub-title font-semibold">สรุปรายการลงทะเบียน</h2>
            {bookingList.length > 0 && renderForm()}
            {bookingList.length === 0 && (
                <div className="block">
                    ไม่มีวิชาที่คุณเลือกลงทะเบียนอยู่
                    <Link href="/">
                        <a className="text-indigo-500 text-center">กลับหน้าหลัก</a>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CheckoutPage
