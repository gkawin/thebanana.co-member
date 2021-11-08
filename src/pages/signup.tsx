import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'

import { NextPage } from 'next'

import React, { useState, useEffect } from 'react'

export type SignInPageForm = {
    phoneNumber: string
    acceptedTC: boolean
}

const SignInPage: NextPage = () => {
    const [confirmationResult, setConfirmationResult] = useState<firebase.default.auth.ConfirmationResult>(null)

    useEffect(() => {
        if (confirmationResult) {
            setConfirmationResult(confirmationResult)
        }
    }, [confirmationResult])

    return (
        <div style={{ minHeight: '100vh' }}>
            <MobilePhoneForm onConfirmedChange={setConfirmationResult} />
            {confirmationResult && <OTPForm confirmationResult={confirmationResult} />}
        </div>
    )
}

export default SignInPage
