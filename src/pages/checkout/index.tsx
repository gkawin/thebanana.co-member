// import { CheckoutFormField } from '@/components/checkout/BookingInfoForm'
import { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useEffect } from 'react'
import useUserHistories from '@/concerns/use-user-histories'
// import { useRouter } from 'next/router'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { ProductModel } from '@/models/ProductModel'

const CheckoutPage: NextPage = () => {
    const histories = useUserHistories()
    // const { query } = useRouter()

    const shouldCheckout = histories.total > 0

    // const onCheckout = async (data: CheckoutFormField) => {
    //     console.log(data)
    // }

    useEffect(() => {
        console.log(histories)
    })

    return (
        <div className="p-4">
            <Head>
                <title>จองและชำระเงิน</title>
            </Head>
            <h2 className="text-sub-title font-semibold">สรุปรายการลงทะเบียน</h2>
            {shouldCheckout && (
                <RegistrationSummary
                    name={(histories.WAITING_FOR_PAYMENT[0].product as ProductModel).name}
                    price={(histories.WAITING_FOR_PAYMENT[0].product as ProductModel).price}
                />
            )}
            {!shouldCheckout && (
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
