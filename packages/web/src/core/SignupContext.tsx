import axios from 'axios'
import { ConfirmationResult, getAuth, signInWithPhoneNumber, updateProfile } from 'firebase/auth'
import { createContext, useContext, useMemo, useState } from 'react'
import { useRecaptchaForm } from '@/concerns/use-recaptcha-form'
import { withModel, UserModelV2 } from '@thebanana/core/lib/models'
import { SocialPlatform, UserStatus } from '@/constants'

export type SignupContextProps = {
    sentOtp: boolean
    requestOtp: (phoneNumber: string) => Promise<void>
    confirmOtp: (otp: string) => Promise<void>
}

const context = createContext<SignupContextProps>(null)

export const SignupContext: React.FC = ({ children }) => {
    const { sentOtp, resetRecaptcha } = useRecaptchaForm({ containerId: 'recaptcha-container' })
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>(null)

    const methods: SignupContextProps = {
        sentOtp,
        requestOtp: async (phoneNumber: string) => {
            if (window.recaptchaVerifier) {
                const auth = getAuth()
                const verifier = window.recaptchaVerifier
                const result = await signInWithPhoneNumber(auth, phoneNumber, verifier)
                setConfirmationResult(result)
            }
        },
        confirmOtp: async (otp: string) => {
            try {
                if (!confirmationResult) throw new Error()

                const credential = await confirmationResult.confirm(otp)

                const { user } = credential

                const lineProfile = await window.liff.getProfile()

                updateProfile(user, {
                    displayName: lineProfile.displayName,
                    photoURL: lineProfile.pictureUrl,
                })

                const payload = withModel(UserModelV2).fromJson({
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    platform: SocialPlatform.LINE,
                    socialId: lineProfile.userId,
                    status: UserStatus.ACTIVE,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    firstname: '',
                    lastname: '',
                    nickname: '',
                })

                const token = await user.getIdToken()

                await axios.post(`/api/users/${user.uid}/create`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                resetRecaptcha()
            } catch (error) {
                console.log(error)
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

export const useSignUp = () => {
    if (!context) throw new Error('no context')
    const ctx = useContext(context)
    return useMemo(() => ctx, [ctx])
}
