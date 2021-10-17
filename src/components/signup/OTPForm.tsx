import { TextField, Button } from '@mui/material'

export type IOtpFormProps = {
    confirmationResult: firebase.default.auth.ConfirmationResult
}

export const OTPForm: React.VFC<IOtpFormProps> = () => {
    return (
        <form>
            <TextField type="text" label="หมายเลข OTP ที่ได้รับจาก SMS 6 หลัก" placeholder="123456"></TextField>
            <Button type="submit" variant="contained">
                ยืนยัน
            </Button>
        </form>
    )
}
