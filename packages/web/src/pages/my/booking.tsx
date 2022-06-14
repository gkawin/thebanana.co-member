import { BookingFilterPanel } from 'packages/web/src/components/my-booking/BookingFilterPanel'
import useMyBooking from 'packages/web/src/concerns/use-my-booking'
import { NextPage } from 'next'
import Link from 'next/link'
import { withThaiDateFormat } from 'packages/web/src/utils/date'

const MyBookingPage: NextPage = () => {
    const { items, setBookingGroup, bookingGroup } = useMyBooking()

    return (
        <div className="container py-4">
            <h1 className="text-title">การจองของฉัน</h1>
            <BookingFilterPanel setBookingGroup={setBookingGroup} bookingGroup={bookingGroup} />
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-2 py-2">
                            รายการ
                        </th>
                        <th scope="col" className="px-2 py-2">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((booking) => {
                        return (
                            <tr key={booking.billingId}>
                                <th
                                    scope="row"
                                    className="px-2 py-2 font-medium text-gray-700 text-sm whitespace-nowrap"
                                >
                                    <div className="text-sm font-semibold">{booking.productName}</div>
                                    <div className="text-gray-600 font-thin text-xs">
                                        หมายเลขการจอง: <span className="font-semibold">{booking.bookingCode}</span>
                                    </div>
                                    <div className="font-thin text-xs text-gray-600">
                                        เริ่ม{' '}
                                        <span className="font-semibold">
                                            {withThaiDateFormat(booking.startDate, 'dd DD MMM BBBB')}
                                        </span>
                                    </div>
                                    <div className="font-thin text-xs text-gray-600">
                                        ถึง{' '}
                                        <span className="font-semibold">
                                            {withThaiDateFormat(booking.endDate, 'dd DD MMM BBBB')}
                                        </span>
                                    </div>
                                    <div className="text-red-500">{booking.pricing}</div>
                                </th>
                                <td className="px-2 py-2 text-right">
                                    <Link
                                        href={{
                                            pathname: '/my/editbooking',
                                            query: { bookingCode: encodeURIComponent(booking.bookingCode) },
                                        }}
                                    >
                                        <a className="font-medium text-indigo-600 border border-indigo-600 p-2 rounded hover:bg-indigo-600 hover:text-white">
                                            จัดการ
                                        </a>
                                    </Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default MyBookingPage
