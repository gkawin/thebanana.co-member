import { MobilePhoneForm } from 'packages/web/src/components/signup/MobilePhoneForm'
import { OTPForm } from 'packages/web/src/components/signup/OTPForm'
import { SignupContext } from 'packages/web/src/core/SignupContext'

import { NextPage } from 'next'

export type SignInPageForm = {
    phoneNumber: string
    acceptedTC: boolean
}

const SignUpPage: NextPage = () => {
    return (
        <SignupContext>
            <div className="container pt-4">
                <MobilePhoneForm />
                <OTPForm />
            </div>
        </SignupContext>
    )
}

export default SignUpPage
