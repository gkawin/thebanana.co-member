import { Liff } from '@liff/liff-types'
import type { LiffCore } from '@line/liff/dist/lib/liff'

export {}
declare global {
    interface Window {
        recaptchaVerifier: any
        recaptchaWidgetId?: any
        grecaptcha?: any
        liff?: Liff
    }
}
