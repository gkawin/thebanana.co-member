import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'
import { SignupContext } from '@/core/SignupContext'
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
