import { useRecaptchaForm } from '@/concerns/use-recaptcha-form'
import { SocialPlatform, UserStatus } from '@/constants'
import { withModel } from '@/models/Model'
import { UserModelV2 } from '@/models/user/user.model'
import { ConfirmationResult, getAuth, signInWithPhoneNumber, updateProfile } from 'firebase/auth'
import { createContext, useContext, useMemo, useState } from 'react'
import { useAxios } from './RootContext'

export type SignupContextProps = {
    sentOtp: boolean
    requestOtp: (phoneNumber: string) => Promise<void>
    confirmOtp: (otp: string) => Promise<void>
}

const context = createContext<SignupContextProps>(null)

export const SignupContext: React.FC = ({ children }) => {
    const { sentOtp, resetRecaptcha } = useRecaptchaForm({ containerId: 'recaptcha-container' })
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>(null)
    const $axios = useAxios()

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

                await $axios.post(`/api/users/${user.uid}/create`, payload)

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
