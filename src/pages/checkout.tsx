import { NextPage } from 'next'

const CheckoutPage: NextPage = () => {
    return (
        <div className="container px-4">
            <h1>สรุปภาพรวม</h1>
            <div className="grid grid-cols-2">
                <span>
                    <strong>รายการ</strong>
                </span>
                <span>
                    <strong>วิชาที่เลือก</strong>
                </span>
                <span>test</span>
                <span>test</span>
            </div>
        </div>
    )
}

export default CheckoutPage
