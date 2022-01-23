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
    createOmiseCharges: <T = object>(product: ProductModel) => Promise<T>
}

const PaymentContext = createContext<PaymentContextProps>(null)

export const PaymentProvider: React.FC<{ productId: string }> = ({ children, productId }) => {
    const [step, setPaymentStep] = useState<PaymentStep>(PaymentStep.INIT)
    const { post } = useAxios()

    const createOmiseCharges = useCallback<PaymentContextProps['createOmiseCharges']>(
        (product: ProductModel) => {
            if (!(window.Omise && window.OmiseCard)) throw new Error('need initialized OmiseJs first.')

            window.OmiseCard.configure({
                publicKey: 'pkey_test_5q52539zzmb9psl4k9p',
            })

            return new Promise((resolve, reject) => {
                window.OmiseCard.open({
                    amount: product.price * 100,
                    frameLabel: 'บริษัท วันบุ๊ค จำกัด',
                    locale: 'th',
                    onCreateTokenSuccess: async (nonce: string) => {
                        const isToken = nonce.startsWith('tokn_')
                        post('/api/payment/charge', {
                            token: isToken ? nonce : null,
                            source: !isToken ? nonce : null,
                            product: serialize(product),
                        })
                            .then(({ data }) => resolve(data))
                            .catch(reject)
                    },
                })
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
