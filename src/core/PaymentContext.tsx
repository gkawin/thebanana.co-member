import { PaymentStep } from '@/constants'
import { ProductModel } from '@/models/ProductModel'
import Script from 'next/script'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { serialize } from 'typescript-json-serializer'
import { useAxios } from './RootContext'

export type PaymentContextProps = {
    step: PaymentStep
    productId: string
    setPaymentStep: (step: PaymentStep) => void
    createOmiseCharges: (product: ProductModel) => void
}

const PaymentContext = createContext<PaymentContextProps>(null)

export const PaymentProvider: React.FC<{ productId: string }> = ({ children, productId }) => {
    const [step, setPaymentStep] = useState<PaymentStep>(PaymentStep.INIT)
    const { post } = useAxios()

    const createOmiseCharges: PaymentContextProps['createOmiseCharges'] = useCallback(
        (product) => {
            if (!(window.Omise && window.OmiseCard)) throw new Error('need initialized OmiseJs first.')

            window.OmiseCard.configure({
                publicKey: 'pkey_test_5q52539zzmb9psl4k9p',
            })

            window.OmiseCard.open({
                amount: product.price * 100,
                currency: 'THB',
                defaultPaymentMethod: 'credit_card',
                onCreateTokenSuccess: async (nonce: string) => {
                    const isToken = nonce.startsWith('tokn_')
                    await post('/api/payment/charge', {
                        token: isToken ? nonce : null,
                        source: !isToken ? nonce : null,
                        product: serialize(product),
                    })
                },
            })
        },
        [post]
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
