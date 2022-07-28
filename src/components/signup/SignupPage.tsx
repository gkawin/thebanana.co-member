import { MobilePhoneForm } from '@/components/signup/MobilePhoneForm'
import { OTPForm } from '@/components/signup/OTPForm'
import { SignupContext } from '@/core/SignupContext'

const SignUpPage: React.FC = () => {
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
