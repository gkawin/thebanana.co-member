import { ProductModel } from '@/models/ProductModel'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { AddressForm } from '@/components/checkout/AddressForm'

export type CheckoutFormProps = {
    productId: string
    address: string
    userId: string
}

const CheckoutPage: NextPage = () => {
    const { handleSubmit } = useForm<CheckoutFormProps>()

    const [productInfo, setProductInfo] = useState<ProductModel>(null)
    const onCheckout = async (data) => {}

    useEffect(() => {}, [])

    const renderForm = () =>
        productInfo && (
            <form onSubmit={handleSubmit(onCheckout)}>
                <div className="py-4">
                    <div className="grid grid-flow-row">
                        <div>คอร์สเรียน</div>
                        <div>{productInfo.name}</div>
                        <div>ราคา</div>
                        <div>{productInfo.pricing}</div>
                    </div>
                </div>
                <AddressForm />
                <button type="submit" className="bg-indigo-500 rounded p-2 my-2 block w-full">
                    ชำระเงิน
                </button>
            </form>
        )

    return (
        <div className="max-w-xl container mx-auto p-4" style={{ minWidth: '20rem' }}>
            <h2 className="text-xl font-semibold">สรุปรายการลงทะเบียน</h2>
            {renderForm()}
            {!productInfo && (
                <div className="block">
                    ไม่มีวิชาที่คุณเลือกลงทะบียต่อนนี้
                    <Link href="/">
                        <a className="text-indigo-500 text-center">กลับหน้าหลัก</a>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CheckoutPage
