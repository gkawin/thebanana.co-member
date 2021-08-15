import { mobileToThaiNumber } from '@/utils/phone-number'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFirebase } from './FirebaseApp'

export const useFirebaseFormHandlers = <T extends { phoneNumber: string; [k: string]: any }>(el: {
    containerId: string
}) => {
    const firebase = useFirebase()
    const [loading, setLoading] = useState(false)
    const [confirmationResult, setConfirmationResult] = useState<firebase.default.auth.ConfirmationResult>()
    const [phoneNumber, setPhoneNumber] = useState(null)

    const initRecaptcha = useCallback(
        async (containerId: string) => {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
                    size: 'invisible',
                    'expired-callback': () => {
                        window.grecaptcha.reset(window.recaptchaWidgetId)
                    },
                })
            }
        },
        [firebase.auth.RecaptchaVerifier]
    )

    const renderRecaptcha = useCallback(async () => {
        if (window.recaptchaVerifier && !window.recaptchaWidgetId) {
            const widgetId = await window.recaptchaVerifier.render()
            window.recaptchaWidgetId = widgetId
        }
    }, [])

    const methods = useMemo(
        () => ({
            confirmationResult,
            phoneNumber,
            loading,
            onSignInWithPhoneNumber: async (data: T) => {
                setPhoneNumber(data.phoneNumber as any)
                const appVerifier = window.recaptchaVerifier
                firebase
                    .auth()
                    .signInWithPhoneNumber(mobileToThaiNumber(data.phoneNumber), appVerifier)
                    .then((result) => {
                        setConfirmationResult(result)
                    })
                    .catch((error) => {
                        console.error(error)
                        window.grecaptcha.reset(window.recaptchaWidgetId)
                    })
            },

            triggerSubmitHandler: async (data: T) => {
                const widgetId = window.recaptchaWidgetId
                try {
                    setLoading(true)
                    await window.grecaptcha.execute(widgetId, { action: 'submit' })
                    await methods.onSignInWithPhoneNumber(data)
                } catch (error) {
                    console.error(error)
                } finally {
                    setLoading(false)
                }
            },
        }),
        [confirmationResult, firebase, phoneNumber, loading]
    )

    const _initializeRecaptcha = useCallback(async () => {
        await initRecaptcha(el.containerId)
        await renderRecaptcha()
        setLoading(false)
    }, [el.containerId, initRecaptcha, renderRecaptcha])

    useEffect(() => {
        if (firebase.apps.length === 1 && !window.recaptchaWidgetId) {
            _initializeRecaptcha()
        }
        setLoading(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_initializeRecaptcha, firebase.apps.length])

    return methods
}
