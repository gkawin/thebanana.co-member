import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { AddressForm } from '@/components/checkout/AddressForm'
import { BookingStatus } from '@/models/BookingModel'
import useUserHistories from '@/concerns/use-user-histories'
import useProductsList from '@/concerns/use-products-list'
import { useCallback } from 'react'
import { ProductModel } from '@/models/ProductModel'

export type CheckoutFormProps = {
    productId: string
    address: string
    userId: string
}

const CheckoutPage: NextPage = () => {
    const histories = useUserHistories()
    const products = useProductsList()
    const { handleSubmit } = useForm<CheckoutFormProps>()

    const onCheckout = async () => {
        console.log()
    }

    const getProductInfo = useCallback(
        (productId: string) => {
            return products.find((product) => product.id === productId) || ({} as ProductModel)
        },
        [products]
    )

    let totalPrice = 0
    const calcVAT = (price: number, ratio = 0.07) => Number(price * ratio)

    const renderForm = () => (
        <form onSubmit={handleSubmit(onCheckout)} className="grid gap-y-4">
            <div className="p-4 border shadow-md rounded">
                <div className="mb-2">
                    {histories.categories[BookingStatus.WAITING_FOR_PAYMENT].map((booking) => {
                        const product = getProductInfo(booking.product)
                        totalPrice += product.price
                        return (
                            <div key={Math.random().toString()} className="grid grid-rows-2 grid-cols-2 gap-4 ">
                                <div className=" text-lg col-span-2">{product.name}</div>
                                <div className="self-end">ราคา/คน</div>
                                <div className="self-end justify-self-end font-semibold text-black">
                                    {product.pricing}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="border w-full"></div>
                <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                    <span>ราคาไม่รวมภาษีมูลค่าเพิ่ม 7%</span>
                    <span>
                        {`${Number(totalPrice - calcVAT(totalPrice)).toLocaleString('th', {
                            minimumFractionDigits: 2,
                            minimumIntegerDigits: 2,
                        })} ยาท`}
                    </span>
                </div>
                <div className="flex flex-row justify-between pt-2 text-sm text-gray-500">
                    <span>ภาษีมูลค่าเพิ่ม 7%</span>
                    <span>
                        {`${calcVAT(totalPrice).toLocaleString('th', {
                            minimumFractionDigits: 2,
                            minimumIntegerDigits: 2,
                        })} บาท`}
                    </span>
                </div>
                <div className="p-2 mt-4 bg-yellow-400 rounded text-2xl font-semibold flex flex-row justify-between">
                    <span>ยอดชำระ</span>
                    <span>{`${totalPrice.toLocaleString('th', {
                        minimumFractionDigits: 2,
                        minimumIntegerDigits: 2,
                    })} บาท`}</span>
                </div>
            </div>
            <div>
                <AddressForm />
            </div>
            <button type="submit" className="bg-indigo-500 rounded p-2 my-2 block w-full text-white">
                ชำระเงิน
            </button>
        </form>
    )

    return (
        <div className="p-4">
            <h2 className="text-sub-title font-semibold">สรุปรายการลงทะเบียน</h2>
            {histories.categories[BookingStatus.WAITING_FOR_PAYMENT].length > 0 && renderForm()}
            {histories.categories[BookingStatus.WAITING_FOR_PAYMENT].length === 0 && (
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
