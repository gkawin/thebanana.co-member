import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { FormProvider, useForm } from 'react-hook-form'
import Link from 'next/link'
import { BookingStatus, DatasetType, PaymentMethod } from '@/constants'
import { CheckoutSummary } from '@/components/checkout-flow/CheckoutSummary'
import { PaymentProvider } from '@/core/PaymentContext'
import { SelectPaymentMethod } from '@/components/checkout-flow/SelectPaymentMethod'
import { PaymentChargesButton } from '@/components/checkout/PaymentChargesButton'
import { PaymentStatusModal } from '@/components/checkout/PaymentStatusModal'
import { CourseModel } from '@/models/course/course.model'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { BookingInfoCard } from '@/components/checkout/BookingInfoCard'
import { AddressListCard } from '@/components/checkout/AddressListCard'
import { useUserInfo } from '@/core/RootContext'
import { useEffect } from 'react'
import { serialize } from 'typescript-json-serializer'

export type CheckoutPageProps = {
    course: CourseModel
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
    const { uid } = useUserInfo()

    useEffect(() => {
        if (uid) {
            methods.register('userId', { value: uid })
            methods.register('productId', { value: props.course.id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid, props.course.id])

    const isBookingNotExist = !props.course
    return (
        <div className="p-4">
            <Head>
                <title>จองและชำระเงิน</title>
            </Head>
            <h2 className="text-sub-title font-semibold">เลือกวิธีการชำระเงิน</h2>
            {!isBookingNotExist && (
                <PaymentProvider courseId={props.course.id} amount={props.course.price}>
                    <PaymentStatusModal />
                    <FormProvider {...methods}>
                        <form className="grid gap-y-4">
                            <CheckoutSummary>
                                <RegistrationSummary name={props.course.title} price={props.course.price} />
                                <BookingInfoCard />
                                <AddressListCard />
                            </CheckoutSummary>
                            <SelectPaymentMethod />
                            <PaymentChargesButton product={props.course} />
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

export const getServerSideProps: GetServerSideProps<CheckoutPageProps> = async ({ params }) => {
    const { db } = adminSDK()
    const slug = String(params.slug)

    const courseCol = await db
        .collection('courses')
        .withConverter(Model.convert(CourseModel))
        .orderBy('slug')
        .startAt(slug)
        .endAt(`${slug}\uf8ff`)
        .limit(1)
        .get()

    if (courseCol.empty) {
        return { notFound: true, props: { slug: null, product: null } } as any
    }

    const course = courseCol.docs[0].data()

    return {
        props: {
            slug,
            course: serialize(course),
        },
    }
}

export default PurchasePage
