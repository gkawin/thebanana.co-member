import { ProductModel } from '@/models/ProductModel'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { AddressForm } from '@/components/checkout/AddressForm'
import { collection, getDocs, query, where } from '@firebase/firestore'
import { useFirebase } from '@/core/RootContext'
import Model from '@/models/Model'
import { BookingModel, BookingStatus } from '@/models/BookingModel'

export type CheckoutFormProps = {
    productId: string
    address: string
    userId: string
}

const CheckoutPage: NextPage = () => {
    const { handleSubmit } = useForm<CheckoutFormProps>()

    const [bookingList, setBookingList] = useState<BookingModel[]>([])
    const onCheckout = async (data) => {}
    const { db } = useFirebase()

    useEffect(() => {
        const q = query(
            collection(db, 'booking'),
            where('status', '==', BookingStatus.WAITING_FOR_PAYMENT)
        ).withConverter(Model.convert(BookingModel))
        getDocs(q).then((docs) => {
            setBookingList(docs.docs.map((v) => v.data()))
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderForm = () => (
        <form onSubmit={handleSubmit(onCheckout)}>
            <div className="py-4">
                {bookingList.map((booking) => (
                    <div key={Math.random().toString()} className="grid grid-flow-row">
                        <div>คอร์สเรียน</div>
                        <div className="text-gray-500 font-light">{booking.productRef}</div>
                        <div>ราคา</div>
                        <div>{booking.status}</div>
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
