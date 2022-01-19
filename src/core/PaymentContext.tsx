import { PaymentStep } from '@/constants'
import { createContext, useContext, useMemo, useState } from 'react'

export type PaymentContextProps = {
    step: PaymentStep
    productId: string
    setPaymentStep: (step: PaymentStep) => void
}

const PaymentContext = createContext<PaymentContextProps>(null)

export const PaymentProvider: React.FC<{ productId: string }> = ({ children, productId }) => {
    const [step, setPaymentStep] = useState<PaymentStep>(PaymentStep.INIT)
    return <PaymentContext.Provider value={{ productId, setPaymentStep, step }}>{children}</PaymentContext.Provider>
}

export const usePaymentContext = () => {
    const ctx = useContext(PaymentContext)
    if (!ctx) throw new Error('use under PaymentContext.Provider')
    return useMemo(() => ctx, [ctx])
}
