import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'
import { useRecaptchaForm } from '@/concerns/use-recaptcha-form'
import { getApp } from 'firebase/app'
import { ConfirmationResult, getAuth, signInWithPhoneNumber } from 'firebase/auth'
// import { useRecaptchaForm } from '@/concerns/use-recaptcha-form'
// import { useFirebase, useUser } from '@/core/RootContext'

import { NextPage } from 'next'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export type SignInPageForm = {
    phoneNumber: string
    acceptedTC: boolean
}

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

const SignUpPage: NextPage = () => {
    return (
        <RecaptchaContext>
            <div className="container m-auto">
                <MobilePhoneForm />
                <OTPForm />
            </div>
        </RecaptchaContext>
    )
}

export default SignUpPage
