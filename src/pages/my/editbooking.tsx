import useMyBooking from '@/concerns/use-my-booking'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { GetServerSideProps, NextPage } from 'next'
import { useUserInfoContext } from '@/core/RootContext'
import { PaymentMethodLabel } from '@/constants'
import Link from 'next/link'
import { withThaiDateFormat } from '@/utils/date'

export type MyEditBookingProps = {
    bookingCode: string
}

const MyEditBooking: NextPage<MyEditBookingProps> = ({ bookingCode }) => {
    const { personal, schools } = useUserInfoContext()
    const { items } = useMyBooking({ bookingCode })
    const bookingInfo = items[0]

    return (
        bookingInfo && (
            <div className="container py-4 grid gap-y-4">
                <Link href="/my/booking">
                    <a className="text-indigo-500 ">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        กลับไปหน้าการจอง
                    </a>
                </Link>
                <div className="px-2 py-4 rounded shadow-gray-300 shadow border border-gray-50">
                    <div>หมายเลขการจอง: {bookingInfo.bookingCode}</div>
                    <div>เริ่มเรียน: {withThaiDateFormat(bookingInfo.startDate, 'dddd DD MMMM BBBB')}</div>
                    <div>วันสุดท้าย: {withThaiDateFormat(bookingInfo.endDate, 'dddd DD MMMM BBBB')}</div>

                    <button className="py-2 text-center text-indigo-700" type="button">
                        <FontAwesomeIcon icon={faReceipt} />
                        <span> ออกใบเสร็จ/ใบกำกับภาษี</span>
                    </button>
                </div>
                <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50">
                    <h2 className="py-2">ข้อมูลผู้เรียน</h2>
                    <div className="text-sm">
                        <h3>
                            {' '}
                            {personal?.fullname} ({personal?.nickname})
                        </h3>
                        <div className="text-gray-500 text-xs">โรงเรียน{schools[0]?.school}</div>
                    </div>
                </div>
                <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50">
                    <h2 className="py-2">ข้อมูลการจัดส่งหนังสือ</h2>
                    <div className="text-sm">
                        <h3 className="text-gray-500 text-xs">จัดส่งไปที่</h3>
                        <span>{bookingInfo.shippingAddress}</span>
                    </div>
                </div>
                <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50">
                    <h2 className="py-2">ข้อมูลการชำระเงิน</h2>
                    <div className="text-sm divide-y ">
                        <div className="flex justify-between py-4 font-semibold">
                            <span>ราคา</span>
                            <span>{bookingInfo.pricing}</span>
                        </div>

                        <div className="py-4">
                            <h3 className="text-gray-500 text-xs">วิธีการชำระเงิน</h3>
                            <div>{PaymentMethodLabel.get(bookingInfo.paymentMethod)}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    if (!query?.bookingCode) return { props: {}, notFound: true }

    return {
        props: {
            bookingCode: query.bookingCode,
        },
    }
}

export default MyEditBooking
