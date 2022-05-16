import { useRecaptchaForm } from '@/concerns/use-recaptcha-form'
import { ConfirmationResult, getAuth, signInWithPhoneNumber } from 'firebase/auth'
import { createContext, useContext, useMemo, useState } from 'react'

export type RecaptchaContextProps = {
    sentOtp: boolean
    requestOtp: (phoneNumber: string) => Promise<void>
    confirmationResult: ConfirmationResult
}

const context = createContext<RecaptchaContextProps>(null)

export const RecaptchaContext: React.FC = ({ children }) => {
    const { sentOtp } = useRecaptchaForm({ containerId: 'recaptcha-container' })
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>(null)

    const methods: RecaptchaContextProps = {
        sentOtp,
        confirmationResult,
        requestOtp: async (phoneNumber: string) => {
            if (window.recaptchaVerifier) {
                const auth = getAuth()
                const verifier = window.recaptchaVerifier
                const result = await signInWithPhoneNumber(auth, phoneNumber, verifier)
                setConfirmationResult(result)
            }
        },
    }

    return (
        <context.Provider value={methods}>
            {children}
            <div id="recaptcha-container"></div>
        </context.Provider>
    )
}

export const useRecaptchaContext = () => {
    if (!context) throw new Error('no context')
    const ctx = useContext(context)
    return useMemo(() => ctx, [ctx])
}
