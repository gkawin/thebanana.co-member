import { getApps } from 'firebase/app'
import { getAuth, RecaptchaVerifier } from 'firebase/auth'
import { useCallback, useEffect, useState } from 'react'

export const useRecaptchaForm = (el: { containerId: string }) => {
    const [sentOtp, setSentOtp] = useState(false)

    const initRecaptcha = useCallback(async (containerId: string) => {
        if (!window.recaptchaVerifier) {
            const auth = getAuth()
            window.recaptchaVerifier = new RecaptchaVerifier(
                containerId,
                {
                    size: 'invisible',
                    'expired-callback': () => {
                        setSentOtp(false)
                        window.grecaptcha.reset(window.recaptchaWidgetId)
                    },
                    callback: (response: any) => {
                        setSentOtp(true)
                    },
                },
                auth
            )
        }
    }, [])

    const resetRecaptcha = useCallback(async () => {
        if (window.grecaptcha && !window.recaptchaWidgetId) {
            window.grecaptcha.reset(window.recaptchaWidgetId)
        }
        setSentOtp(false)
    }, [])

    const renderRecaptcha = useCallback(async () => {
        if (window.recaptchaVerifier && !window.recaptchaWidgetId) {
            const widgetId = await window.recaptchaVerifier.render()
            window.recaptchaWidgetId = widgetId
        }
    }, [])

    const _initializeRecaptcha = useCallback(async () => {
        await initRecaptcha(el.containerId)
        await renderRecaptcha()
    }, [el.containerId, initRecaptcha, renderRecaptcha])

    useEffect(() => {
        if (getApps().length > 0 && !window.recaptchaWidgetId) {
            _initializeRecaptcha()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getApps().length])

    return {
        sentOtp,
        resetRecaptcha,
    }
}
