import { useRecaptchaForm } from '@/concerns/use-recaptcha-form'
import { mobileToThaiNumber } from '@/utils/phone-number'
import { useState } from 'react'
import IMask from 'imask'
import { useEffect } from 'react'
import { useRef } from 'react'

export type IMobilePhoneFromProps = {
    onConfirmedChange: (val: firebase.default.auth.ConfirmationResult) => void
}

export const MobilePhoneForm: React.VFC<IMobilePhoneFromProps> = ({ onConfirmedChange }) => {
    const recaptcha = useRecaptchaForm({ containerId: 'recaptcha-container' })
    const [mask, setMask] = useState<IMask.InputMask<any>>(null)
    const inputRef = useRef()

    useEffect(() => {
        if (!mask) {
            const mask = IMask(inputRef.current, {
                mask: '(000)000-0000',
            })
            setMask(mask)
        }
    }, [mask])

    useEffect(() => {
        if (recaptcha.confirmationResult) {
            onConfirmedChange(recaptcha.confirmationResult)
        }
    }, [onConfirmedChange, recaptcha.confirmationResult])

    const handleClick = () => {
        const unmasked = mask.unmaskedValue
        recaptcha.triggerSubmitHandler({
            mobileNumber: mobileToThaiNumber(mobileToThaiNumber(unmasked)),
        })
    }

    return (
        <form>
            <label htmlFor="mobile-phone">เบอร์โทรศัพท์</label>
            <input
                type="text"
                name="mobileNumber"
                id="mobile-phone"
                readOnly={Boolean(recaptcha.confirmationResult)}
            ></input>
            <div id="recaptcha-container"></div>
            <button style={{ marginTop: '1em' }} color="primary" type="submit" onClick={handleClick}>
                รอรับ SMS
            </button>
        </form>
    )
}
