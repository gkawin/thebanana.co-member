import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Link from 'next/link'
import { BookingModel } from '@/models/BookingModel'
import { RegistrationSummary } from '@/components/checkout/RegistrationSummary'
import { BookingInfoForm, CheckoutFormField } from '@/components/checkout/BookingInfoForm'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { ProductModel } from '@/models/ProductModel'

export type CheckoutBookingIdPage = { booking: BookingModel; notFound: boolean; product: ProductModel }

const CheckoutBookingIdPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
    booking,
    notFound,
    product,
}) => {
    const onCheckout = async (data: CheckoutFormField) => {
        console.log(data)
    }

    const renderNotFound = () => (
        <div className="block">
            ไม่มีวิชาที่คุณเลือกลงทะเบียนอยู่
            <Link href="/">
                <a className="text-indigo-500 text-center">กลับหน้าหลัก</a>
            </Link>
        </div>
    )

    return (
        <div className="p-4">
            <h2 className="text-sub-title font-semibold">สรุปรายการลงทะเบียน</h2>

            {!notFound && (
                <>
                    <RegistrationSummary booking={booking} product={product} />
                    <BookingInfoForm onSubmit={onCheckout} />
                </>
            )}

            {notFound && renderNotFound()}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<CheckoutBookingIdPage> = async ({ query }) => {
    const sdk = adminSDK()
    const bookingRef = sdk.firestore().collection('booking').withConverter(Model.transform(BookingModel))
    const productRef = sdk.firestore().collection('products').withConverter(Model.transform(ProductModel))
    const rs = await bookingRef.doc(decodeURIComponent(query.bookingId.toString())).get()

    const bookingInfo = rs.data()
    if (!rs.exists) {
        return {
            props: { notFound: true },
        } as any
    }
    const productInfo = (await productRef.doc(bookingInfo.product).get()).data()

    return {
        props: {
            booking: JSON.parse(JSON.stringify(bookingInfo)) as BookingModel,
            product: JSON.parse(JSON.stringify(productInfo)) as ProductModel,
        },
    }
}

export default CheckoutBookingIdPage
