import useMyBooking from '@/concerns/use-my-booking'
import { BookingStatus } from '@/constants'
import { NextPage } from 'next'

const MyBookingPage: NextPage = () => {
    const bookinglist = useMyBooking()

    return (
        <div className="container">
            <h1 className="text-title">จัดการการจอง</h1>
            <div>
                <h2>ที่ต้องชำระ</h2>
                <table className="table-fixed">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">รายการ</th>
                            <th className="p-2">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookinglist.map((booking) => {
                            return (
                                <tr key={booking.billingId}>
                                    <td>{booking.product.name}</td>
                                    <td>
                                        <div className="grid grid-rows-2">
                                            <div>
                                                {booking.status === BookingStatus.CREATED && 'รอชำระ'}
                                                {booking.status === BookingStatus.PAID && 'ชำระเรียบร้อยแล้ว'}
                                            </div>
                                            <div className="text-xs">
                                                {booking.status === BookingStatus.PAID && (
                                                    <span className="p-1 rounded border border-indigo-500 text-indigo-500">
                                                        ออกใบเสร็จ/ใบกำกับภาษี
                                                    </span>
                                                )}
                                                {booking.status === BookingStatus.CREATED && (
                                                    <span className="p-1 rounded border border-red-500 text-red-500">
                                                        ยกเลิกรายการ
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyBookingPage
