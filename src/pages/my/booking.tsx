import { BookingFilterPanel } from '@/components/my-booking/BookingFilterPanel'
import useMyBooking from '@/concerns/use-my-booking'
import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import dayjsTH from 'dayjs/locale/th'
import { NextPage } from 'next'

dayjs.extend(buddhistEra)
dayjs.locale(dayjsTH)

const MyBookingPage: NextPage = () => {
    const { items, setBookingGroup, bookingGroup } = useMyBooking()

    console.log(items)

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
                                    <div className="text-gray-600">{booking.productName}</div>
                                    <div className="font-semibold">{booking.pricing}</div>
                                    <div className="font-thin text-xs text-gray-600">
                                        เริ่ม {dayjs(booking.startDate).format('DD MMM BBBB')}
                                    </div>
                                    <div className="font-thin text-xs text-gray-600">
                                        ถึง {dayjs(booking.endDate).format('DD MMM BBBB')}
                                    </div>
                                </th>
                                <td className="px-2 py-2 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-indigo-600 border border-indigo-600 p-2 rounded hover:bg-indigo-600 hover:text-white"
                                    >
                                        จัดการ
                                    </a>
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