import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'
import { RecaptchaContext } from '@/core/RecaptchaContext'

import { NextPage } from 'next'

export type SignInPageForm = {
    phoneNumber: string
    acceptedTC: boolean
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
