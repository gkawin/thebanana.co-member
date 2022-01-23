import { PaymentMethod, PaymentMethodLabel, PaymentStep } from '@/constants'
import { usePaymentContext } from '@/core/PaymentContext'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import JCBImage from '@/public/jcb.png'
import MasterCardImage from '@/public/mastercard.png'
import VisaImage from '@/public/visa.png'
import PromtPayLogo from '@/public/promt-pay-logo.png'

export type KeyofPaymentMethods = keyof typeof PaymentMethod

export const SelectPaymentMethod: React.VFC = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    const { step } = usePaymentContext()
    if (step !== PaymentStep.SELECT_PAYMENT_METHOD) return null

    const renderAcceptedCreditCardLogo = (label: KeyofPaymentMethods) => {
        return (
            label === 'CREDIT_CARD' && (
                <div className="flex space-x-1">
                    <span>
                        <Image src={JCBImage} alt="jcb" width={40} height={25} />
                    </span>
                    <span>
                        <Image src={MasterCardImage} alt="mastercard" width={40} height={25} />
                    </span>
                    <span>
                        <Image src={VisaImage} alt="visa" width={40} height={25} />
                    </span>
                </div>
            )
        )
    }

    const renderBankTrasferInfo = (label: KeyofPaymentMethods) => {
        return (
            label === 'BANK_TRANSFER' && (
                <div className="flex space-x-1 text-sm text-gray-500 ">
                    <p>กรุณาโอนเงินไปที่บัญชี</p>
                </div>
            )
        )
    }

    const renderPromptPay = (label: KeyofPaymentMethods) => {
        return (
            label === 'PROMPT_PAY' && (
                <div className="flex space-x-1 text-sm text-gray-500 ">
                    <Image src={PromtPayLogo} alt="prompt-pay" width={48} height={48} />
                </div>
            )
        )
    }

    return (
        <div className="p-4 rounded shadow-md border grid gap-y-4">
            <ul className="grid gap-y-4">
                {Object.values(PaymentMethod)
                    .filter((v) => typeof v === 'string')
                    .map((label: string, idx) => (
                        <li key={label} className="py-4 px-2 border border-gray-200 rounded flex flex-row space-x-2">
                            <input
                                id={label}
                                type="radio"
                                className="form-radio"
                                defaultChecked={idx === 0}
                                value={label}
                                {...register('paymentMethod', { required: true })}
                            />
                            <label htmlFor={label}>
                                {PaymentMethodLabel.get(PaymentMethod[label as KeyofPaymentMethods])}
                                {renderAcceptedCreditCardLogo(label as KeyofPaymentMethods)}
                                {renderBankTrasferInfo(label as KeyofPaymentMethods)}
                                {renderPromptPay(label as KeyofPaymentMethods)}
                            </label>
                        </li>
                    ))}
            </ul>
            <small className="text-red-500">{errors.paymentMethod ? 'กรุณาเลือก' : ''}</small>
        </div>
    )
}
