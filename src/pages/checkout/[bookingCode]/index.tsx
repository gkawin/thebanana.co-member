import { BookingInfoForm } from '@/components/checkout/BookingInfoForm'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { BookingModel } from '@/models/BookingModel'
import { serialize } from 'typescript-json-serializer'
import { ProductModel } from '@/models/ProductModel'
import { AddressForm } from '@/components/checkout/AddressForm'
import { FormProvider, useForm } from 'react-hook-form'
import Link from 'next/link'
import { NewAddressForm } from '@/components/checkout/NewAddressForm'
import { useAxios } from '@/core/RootContext'
import { DatasetType } from '@/constants'

export type CheckoutPageProps = {
    product: ProductModel
}

export type CheckoutFormField = {
    studentName: string
    school: string
    nickname: string
    shippingAddressId: string
    datasetType: DatasetType
}

const CheckoutPage: NextPage<CheckoutPageProps> = (props) => {
    const methods = useForm<CheckoutFormField>()
    const { post } = useAxios()

    const onSubmit = async (payload: CheckoutFormField) => {
        const { data } = await post('/api/checkout', payload)
        if (data) {
        }
    }

    const isBookingNotExist = !props
    return (
        <div className="p-4">
            <Head>
                <title>จองและชำระเงิน</title>
            </Head>
            <h2 className="text-sub-title font-semibold">สรุปรายการลงทะเบียน</h2>
            {!isBookingNotExist && (
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-y-4">
                        <RegistrationSummary name={props.product.name} price={props.product.price} />
                        <div className="p-4 rounded shadow-md border flex flex-col">
                            <h2 className="text-2xl font-semibold">รายละเอียดผู้เรียน</h2>
                            <BookingInfoForm />
                        </div>
                        <div className="p-4 rounded shadow-md border">
                            <h2 className="text-sub-title font-semibold">ที่อยู่ในการจัดส่งเอกสาร</h2>
                            <AddressForm />
                            <NewAddressForm enabled />
                        </div>
                        <button type="submit" className="bg-indigo-500 rounded p-2 my-2 block w-full text-white">
                            ไปยังหน้าชำระเงิน
                        </button>
                    </form>
                </FormProvider>
            )}

            {isBookingNotExist && (
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

export const getServerSideProps: GetServerSideProps<CheckoutPageProps> = async ({ query }) => {
    const { db } = adminSDK()
    const bookingCode = query?.bookingCode

    if (!bookingCode) {
        return { notFound: true, props: null }
    }

    const bookingInfo = await db
        .collection('booking')
        .where('bookingCode', '==', bookingCode.toString())
        .orderBy('createdOn', 'desc')
        .withConverter(Model.convert(BookingModel))
        .limit(1)
        .get()
        .then((ss) => ss.docs[0])

    if (!bookingInfo.exists) {
        return { props: null }
    }

    const product = await (bookingInfo.data().product as FirebaseFirestore.DocumentReference)
        .withConverter(Model.convert(ProductModel))
        .get()
        .then((data) => serialize(data.data()))

    return {
        props: {
            product,
        },
    }
}

export default CheckoutPage
