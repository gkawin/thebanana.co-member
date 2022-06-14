import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faQrcode, faDownload } from '@fortawesome/free-solid-svg-icons'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'

import { GetServerSideProps, NextPage } from 'next'

import Link from 'next/link'

import { useEffect, useState } from 'react'
import { useUser } from '@/core/RootContext'
import useMyBooking from '@/concerns/use-my-booking'
import { BookingStatus, PaymentMethod, PaymentMethodLabel } from '@/constants'
import { withThaiDateFormat } from '@thebanana-members/core/lib/utils'

export type MyEditBookingProps = {
    bookingCode: string
}

const MyEditBooking: NextPage<MyEditBookingProps> = ({ bookingCode }) => {
    const { personal, schools } = useUser()
    const { items } = useMyBooking({ bookingCode })
    const bookingInfo = items[0]
    const [receiptUrl, setReceiptUrl] = useState<string>('')

    useEffect(() => {
        if (bookingInfo?.receipt) {
            const generateDownloadableReceiptLink = async (filePath: string) => {
                const storage = getStorage()
                const receiptRef = ref(storage, filePath)
                const downloadURL = await getDownloadURL(receiptRef)
                console.log(downloadURL)
                setReceiptUrl(downloadURL)
            }
            generateDownloadableReceiptLink(bookingInfo?.receipt.filepath)
        }
    }, [bookingInfo?.receipt])

    const renderPaymentAlert = () => {
        return (
            bookingInfo.status === BookingStatus.CREATED && (
                <div className="py-4 text-center b border border-red-300 bg-red-200 text-red-700 rounded">
                    กรุณาชำระเงินภายในวันที่{' '}
                </div>
            )
        )
    }

    const renderPaymentOperation = () => {
        return (
            <>
                <div>
                    <h3 className="text-gray-500 text-sm">วิธีการชำระเงิน</h3>
                    <div>{PaymentMethodLabel.get(bookingInfo.paymentMethod)}</div>
                </div>
                {[BookingStatus.PAID, BookingStatus.EXPIRED].includes(bookingInfo.status) && (
                    <div className="py-4">
                        <div>ใบเสร็จ/ใบกำกับภาษี</div>
                        {!bookingInfo.receipt && <div>ไม่มีรายการใบเสร็จ/ใบกำกับภาษี</div>}
                        {bookingInfo.receipt && (
                            <Link href={receiptUrl}>
                                <a target="_blank" className="text-sm text-gray-500 flex justify-between">
                                    <span className="underline">{bookingInfo.receipt.receiptId}</span>
                                    <FontAwesomeIcon icon={faDownload} />
                                </a>
                            </Link>
                        )}
                    </div>
                )}
                {[BookingStatus.CREATED].includes(bookingInfo.status) &&
                    bookingInfo.paymentMethod === PaymentMethod.PROMPT_PAY && (
                        <button type="button" className="text-white bg-indigo-500 p-2 w-full rounded font-semibold">
                            <FontAwesomeIcon icon={faQrcode} />
                            <span> ขอ QR Code เพื่อชำระเงิน</span>
                        </button>
                    )}
            </>
        )
    }

    return (
        bookingInfo && (
            <div className="container py-4 space-y-4">
                <Link href="/my/booking">
                    <a className="text-indigo-500 ">
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        กลับไปหน้าการจอง
                    </a>
                </Link>
                {renderPaymentAlert()}
                <div className="px-2 py-4 rounded shadow-gray-300 shadow border border-gray-50 space-y-1">
                    <h2>รายละเอียด</h2>
                    <div>
                        <span className="text-sm text-gray-500 block">หมายเลขการจอง</span>
                        <span className="font-semibold">{bookingInfo.bookingCode}</span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 block">เริ่มเรียน</span>
                        <span className="font-semibold">
                            {withThaiDateFormat(bookingInfo.startDate, 'dddd DD MMMM BBBB')}
                        </span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 block">วันสุดท้าย</span>
                        <span className="font-semibold">
                            {withThaiDateFormat(bookingInfo.endDate, 'dddd DD MMMM BBBB')}
                        </span>
                    </div>
                </div>
                <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50 space-y-1">
                    <h2>ข้อมูลผู้เรียน</h2>
                    <div className="text-sm">
                        <h3>
                            {personal?.fullname} ({personal?.nickname})
                        </h3>
                        <div className="text-gray-500 text-xs">โรงเรียน{schools[0]?.school}</div>
                    </div>
                </div>
                <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50 space-y-1">
                    <h2>ข้อมูลการจัดส่งหนังสือ</h2>
                    <div className="text-sm">
                        <h3 className="text-gray-500 text-xs">จัดส่งไปที่</h3>
                        <span>{bookingInfo.shippingAddress}</span>
                    </div>
                </div>
                <div className="px-2 py-4 rounded shadow-gray-300 shadow-md border border-gray-50 space-y-1">
                    <h2>ข้อมูลการชำระเงิน</h2>

                    <div>
                        <div className="flex justify-between py-4">
                            <span>ราคา</span>
                            <span className="font-semibold">{bookingInfo.pricing}</span>
                        </div>
                    </div>

                    {renderPaymentOperation()}
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
