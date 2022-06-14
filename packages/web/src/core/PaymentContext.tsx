import { PaymentMethod, PaymentStep } from 'packages/web/src/constants'
import type { ChargeResultModel } from 'packages/web/src/models/payment/ChargeResult.model'
import { CheckoutFormField } from 'packages/web/src/pages/purchase/[slug]'
import Script from 'next/script'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useAxios } from './RootContext'

export type PaymentContextProps = {
    step: PaymentStep
    productId: string
    chargeResult?: ChargeResultModel
    setPaymentStep: (step: PaymentStep) => void
    createOmiseCharges: (formData: CheckoutFormField, method: PaymentMethod) => void
}

export type PaymentProviderProps = { productId: string; amount: number }

const PaymentContext = createContext<PaymentContextProps>(null)

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children, productId, amount = 0 }) => {
    const [step, setPaymentStep] = useState<PaymentStep>(PaymentStep.INIT)
    const [chargeResult, setChargeResult] = useState<ChargeResultModel>(null)
    const { post } = useAxios()

    const handleChargeApi = useCallback(async (formData: { token?: string; source?: string } & Record<string, any>) => {
        try {
            const chargeResult = await post('/api/payment/charge', formData)
            setChargeResult(chargeResult.data)
        } catch (error) {
            setChargeResult(error as ChargeResultModel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                            handleChargeApi({ ...formData, token: isToken ? nonce : null, source: null })
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
                            handleChargeApi({ ...formData, token: null, source: response.id, type: response.type })
                        }
                    )
                    break
                }
            }
        },
        [amount, handleChargeApi]
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
