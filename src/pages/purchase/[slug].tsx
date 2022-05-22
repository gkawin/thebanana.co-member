import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { serialize } from 'typescript-json-serializer'
import { ProductModel } from '@/models/ProductModel'
import { FormProvider, useForm } from 'react-hook-form'
import Link from 'next/link'
import { BookingStatus, DatasetType, PaymentMethod } from '@/constants'
import { CheckoutSummary } from '@/components/checkout-flow/CheckoutSummary'
import { PaymentProvider } from '@/core/PaymentContext'
import { SelectPaymentMethod } from '@/components/checkout-flow/SelectPaymentMethod'
import { PaymentChargesButton } from '@/components/checkout/PaymentChargesButton'
import { useEffect } from 'react'
import { useFirebase } from '@/core/RootContext'
import { PaymentStatusModal } from '@/components/checkout/PaymentStatusModal'
import { CourseModel } from '@/models/course/course.model'

export type CheckoutPageProps = {
    product: ProductModel
    bookingStatus: BookingStatus
}

export type CheckoutFormField = {
    studentName: string
    school: string
    nickname: string
    shippingAddressId: string
    datasetType: DatasetType
    paymentMethod: PaymentMethod
    userId: string
    productId: string
}

const PurchasePage: NextPage<CheckoutPageProps> = (props) => {
    const methods = useForm<CheckoutFormField>()
    const { auth } = useFirebase()

    useEffect(() => {
        if (auth?.currentUser?.uid) {
            methods.register('userId', { value: auth.currentUser.uid })
            methods.register('productId', { value: props.product.id })
        }
    }, [auth?.currentUser?.uid, methods, props.product.id])

    const isBookingNotExist = !props.product
    return (
        <div className="p-4">
            <Head>
                <title>จองและชำระเงิน</title>
            </Head>
            <h2 className="text-sub-title font-semibold">เลือกวิธีการชำระเงิน</h2>
            {!isBookingNotExist && (
                <PaymentProvider productId={props.product.id} amount={props.product.price}>
                    <PaymentStatusModal />
                    <FormProvider {...methods}>
                        <form className="grid gap-y-4">
                            <CheckoutSummary product={props.product} />
                            <SelectPaymentMethod />
                            <PaymentChargesButton product={props.product} />
                        </form>
                    </FormProvider>
                </PaymentProvider>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { db } = adminSDK()
    const slug = String(params.slug)
    const productCol = await db
        .collection('courses')
        .withConverter(Model.convert(CourseModel))
        .orderBy('slug')
        .startAt(slug)
        .endAt(`${slug}\uf8ff`)
        .get()

    if (productCol.empty) {
        return { notFound: true, props: { slug: null, product: null } } as any
    }

    const product = productCol.docs[0].data()

    return {
        props: {
            slug,
            product: serialize(product),
        },
    }
}

export default PurchasePage
