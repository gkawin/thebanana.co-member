import { NextPage } from 'next'

const PaymentPage: NextPage = () => {
    return (
        <div>
            <h1 className="text-title font-semibold">ช่องทางการชำระเงิน</h1>
            <div>โอนเงินเข้าบัญชีธนาคาร</div>
            <div>บัตรเครดิต/บัตรเดบิต</div>
        </div>
    )
}

export default PaymentPage
