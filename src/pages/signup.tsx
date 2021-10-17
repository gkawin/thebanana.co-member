import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'
import { Grid } from '@mui/material'
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
        <Grid style={{ minHeight: '100vh' }} container direction="row" justifyContent="center" alignItems="center">
            <MobilePhoneForm onConfirmedChange={setConfirmationResult} />
            {confirmationResult && <OTPForm confirmationResult={confirmationResult} />}
        </Grid>
    )
}

export default SignInPage
