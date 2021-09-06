import { useRecaptchaForm } from '@/concerns/use-recaptcha-form'
import { mobileToThaiNumber } from '@/utils/phone-number'
import { Button, FormControl, Input, InputLabel } from '@material-ui/core'
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
        <FormControl>
            <InputLabel htmlFor="mobile-phone">เบอร์โทรศัพท์</InputLabel>
            <Input
                inputRef={inputRef}
                type="text"
                inputProps={{ pattern: /\d/, inputMode: 'numeric' }}
                name="mobileNumber"
                id="mobile-phone"
            ></Input>
            <div id="recaptcha-container"></div>
            <Button
                style={{ marginTop: '1em' }}
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleClick}
            >
                รอรับ SMS
            </Button>
        </FormControl>
    )
}
