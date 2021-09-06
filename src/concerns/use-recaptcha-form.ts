import { mobileToThaiNumber } from '@/utils/phone-number'
import firebase from 'firebase/compat/app'
import { useCallback, useEffect, useMemo, useState } from 'react'

export const useRecaptchaForm = <T extends { mobileNumber: string; [k: string]: any }>(el: { containerId: string }) => {
    const [loading, setLoading] = useState(false)
    const [confirmationResult, setConfirmationResult] = useState<firebase.auth.ConfirmationResult>()
    const [mobileNumber, setMobileNumber] = useState(null)

    const initRecaptcha = useCallback(async (containerId: string) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
                size: 'invisible',
                'expired-callback': () => {
                    window.grecaptcha.reset(window.recaptchaWidgetId)
                },
            })
        }
    }, [])

    const renderRecaptcha = useCallback(async () => {
        if (window.recaptchaVerifier && !window.recaptchaWidgetId) {
            const widgetId = await window.recaptchaVerifier.render()
            window.recaptchaWidgetId = widgetId
        }
    }, [])

    const methods = useMemo(
        () => ({
            confirmationResult,
            mobileNumber,
            loading,
            onSignInWithPhoneNumber: async (data: T) => {
                setMobileNumber(data.mobileNumber as any)
                const appVerifier = window.recaptchaVerifier
                firebase
                    .auth()
                    .signInWithPhoneNumber(mobileToThaiNumber(data.mobileNumber), appVerifier)
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
        [confirmationResult, loading, mobileNumber]
    )

    const _initializeRecaptcha = useCallback(async () => {
        await initRecaptcha(el.containerId)
        await renderRecaptcha()
        setLoading(false)
    }, [el.containerId, initRecaptcha, renderRecaptcha])

    useEffect(() => {
        if (firebase.apps.length > 0 && !window.recaptchaWidgetId) {
            _initializeRecaptcha()
        }
        setLoading(true)
    }, [_initializeRecaptcha])

    return methods
}
