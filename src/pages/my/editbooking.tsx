import useMyBooking from '@/concerns/use-my-booking'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'

import { GetServerSideProps, NextPage } from 'next'
import { BookingStatus, PaymentMethodLabel } from '@/constants'
import Link from 'next/link'
import { withThaiDateFormat } from '@/utils/date'
import { useEffect, useState } from 'react'
import { ShippingAddressPanel } from '@/components/editbooking/ShippingAddressPanel'
import { StudentInfoPanel } from '@/components/editbooking/StudentInfoPanel'
import { PaymentActivityInfo } from '@/components/checkout/PaymentActivityInfo'

export type MyEditBookingProps = {
    bookingCode: string
}

const MyEditBooking: NextPage<MyEditBookingProps> = ({ bookingCode }) => {
    const { items } = useMyBooking({ bookingCode })
    const bookingInfo = items[0]
    const [receiptUrl, setReceiptUrl] = useState<string>('')

    console.log(bookingInfo, bookingCode)

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

    const renderPaymentOperation = () => {
        return (
            <>
                <div>
                    <h3 className="text-gray-500 text-sm">วิธีการชำระเงิน</h3>
                    <div>{PaymentMethodLabel.get(bookingInfo.paymentMethod)}</div>
                </div>
                {[BookingStatus.PAID, BookingStatus.EXPIRED].includes(bookingInfo.status) && (
                    <>
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
                    </>
                )}
            </>
        )
    }

    const isRejected = bookingInfo?.status === BookingStatus.REJECTED
    const isPending = bookingInfo?.status === BookingStatus.PENDING

    return (
        bookingInfo && (
            <>
                <div className="container py-4 space-y-4">
                    <Link href="/my/booking">
                        <a className="text-indigo-500 ">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            กลับไปหน้าการจอง
                        </a>
                    </Link>
                    {isPending && (
                        <div className="py-4 text-center border border-red-300 bg-red-50 rounded">
                            <span className="text-lg font-semibold">
                                <PaymentActivityInfo bookingCode={bookingCode} />
                            </span>
                        </div>
                    )}
                    {isRejected && (
                        <div className="py-4 text-center border border-red-300 bg-red-50 rounded">
                            <span className="text-lg font-semibold">
                                ทำรายการไม่สำเร็จ หรือคุณได้ยกเลิกรายการชำระเงิน กรุณาลองใหม่อีกครั้ง
                            </span>
                        </div>
                    )}
                    <div className={`px-2 py-4 rounded shadow-gray-300 shadow border border-gray-50 space-y-1`}>
                        <h2>รายละเอียด</h2>
                        <div>
                            <span className="text-sm text-gray-500 block">หมายเลขการจอง</span>
                            <span className="font-semibold">{bookingInfo.bookingCode}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block">เริ่มเรียน</span>
                            <span className="font-semibold">
                                {withThaiDateFormat(bookingInfo.startDate.toISOString(), 'dddd DD MMMM BBBB')}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block">วันสุดท้าย</span>
                            <span className="font-semibold">
                                {withThaiDateFormat(bookingInfo.endDate.toISOString(), 'dddd DD MMMM BBBB')}
                            </span>
                        </div>
                    </div>
                    <StudentInfoPanel studentInfo={bookingInfo.studentInfo} />
                    <ShippingAddressPanel shippingAddress={bookingInfo.shippingAddress} />
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
            </>
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
