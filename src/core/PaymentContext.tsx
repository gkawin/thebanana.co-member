import { PaymentMethod, PaymentStep } from '@/constants'
import { CheckoutFormField } from '@/pages/purchase/[slug]'
import Script from 'next/script'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useAxios } from './RootContext'

export type PaymentContextProps = {
    step: PaymentStep
    productId: string
    setPaymentStep: (step: PaymentStep) => void
    createOmiseCharges: <T = object>(formData: CheckoutFormField, method: PaymentMethod) => Promise<T>
}

export type PaymentProviderProps = { productId: string; amount: number }

const PaymentContext = createContext<PaymentContextProps>(null)

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children, productId, amount = 0 }) => {
    const [step, setPaymentStep] = useState<PaymentStep>(PaymentStep.INIT)
    const { post } = useAxios()

    const createOmiseCharges = useCallback<PaymentContextProps['createOmiseCharges']>(
        (formData, method): Promise<any> => {
            if (!formData) throw new Error('payload error')
            if (!(window.Omise && window.OmiseCard)) throw new Error('need initialized OmiseJs first.')

            if (method === PaymentMethod.CREDIT_CARD) {
                window.OmiseCard.configure({
                    publicKey: 'pkey_test_5q52539zzmb9psl4k9p',
                })
                return new Promise((resolve, reject) => {
                    window.OmiseCard.open({
                        amount: amount * 100,
                        frameLabel: 'บริษัท วันบุ๊ค จำกัด',
                        locale: 'th',
                        onCreateTokenSuccess: (nonce: string) => {
                            const isToken = nonce.startsWith('tokn_')
                            post('/api/payment/charge', {
                                ...formData,
                                token: isToken ? nonce : null,
                                source: null,
                            })
                                .then(({ data }) => resolve(data))
                                .catch(reject)
                        },
                    })
                })
            }

            if (method === PaymentMethod.PROMPT_PAY) {
                window.Omise.setPublicKey('pkey_test_5q52539zzmb9psl4k9p')
                return new Promise((resolve, reject) =>
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
                                .then(({ data }) => resolve(data))
                                .catch(reject)
                        }
                    )
                )
            }
        },
        [amount, post]
    )

    return (
        <PaymentContext.Provider value={{ productId, setPaymentStep, step, createOmiseCharges }}>
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
