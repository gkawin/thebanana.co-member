import { PaymentMethod, PaymentStep } from '@/constants'
import { CheckoutFormField } from '@/pages/purchase/[slug]'
import Script from 'next/script'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useAxios } from './RootContext'

export type PaymentContextProps = {
    step: PaymentStep
    productId: string
    chargeResult?: ChargeResult
    setPaymentStep: (step: PaymentStep) => void
    createOmiseCharges: (formData: CheckoutFormField, method: PaymentMethod) => void
}

export type PaymentProviderProps = { productId: string; amount: number }
export type ChargeResult = {
    bookingCode: string
    expiredDate: string
    status: string
    source: PaymentMethod
    metadata: Record<string, any>
}

const PaymentContext = createContext<PaymentContextProps>(null)

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children, productId, amount = 0 }) => {
    const [step, setPaymentStep] = useState<PaymentStep>(PaymentStep.INIT)
    const [chargeResult, setChargeResult] = useState<ChargeResult>(null)
    const { post } = useAxios()

    const createOmiseCharges = useCallback<PaymentContextProps['createOmiseCharges']>(
        (formData, method) => {
            if (!formData) throw new Error('payload error')
            if (!(window.Omise && window.OmiseCard)) throw new Error('need initialized OmiseJs first.')

            const publicKey = 'pkey_test_5q52539zzmb9psl4k9p'

            switch (method) {
                case PaymentMethod.CREDIT_CARD: {
                    window.OmiseCard.configure({ publicKey })
                    window.OmiseCard.open({
                        amount: amount * 100,
                        frameLabel: 'บริษัท วันบุ๊ค จำกัด',
                        currency: 'THB',
                        defaultPaymentMethod: 'credit_card',
                        onCreateTokenSuccess: (nonce: string) => {
                            const isToken = nonce.startsWith('tokn_')
                            console.log(nonce)
                            post('/api/payment/charge', {
                                ...formData,
                                token: isToken ? nonce : null,
                                source: null,
                            })
                                .then(({ data }) => {
                                    setChargeResult({
                                        ...data,
                                        status: 'success',
                                    })
                                })
                                .catch((error) => {
                                    console.error(error)
                                    setChargeResult(null)
                                })
                        },
                    })
                    break
                }

                case PaymentMethod.PROMPT_PAY: {
                    window.Omise.setPublicKey(publicKey)
                    window.Omise.createSource(
                        'promptpay',
                        {
                            amount: amount * 100,
                            currency: 'THB',
                        },
                        (statusCode: any, response: any) => {
                            post('/api/payment/charge', {
                                ...formData,
                                token: null,
                                source: response.id,
                                type: response.type,
                            })
                                .then(({ data }) => {
                                    setChargeResult({
                                        ...data,
                                        status: 'success',
                                    })
                                })
                                .catch((error) => {
                                    console.error(error)
                                    setChargeResult(null)
                                })
                        }
                    )
                    break
                }
            }
        },
        [amount, post]
    )

    return (
        <PaymentContext.Provider value={{ productId, setPaymentStep, step, createOmiseCharges, chargeResult }}>
            <Script type="text/javascript" src="https://cdn.omise.co/omise.js"></Script>
            {children}
        </PaymentContext.Provider>
    )
}

export const usePaymentContext = () => {
    const ctx = useContext(PaymentContext)
    if (!ctx) throw new Error('use under PaymentContext.Provider')
    return useMemo(() => ctx, [ctx])
}
