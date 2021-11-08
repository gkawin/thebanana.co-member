export type IOtpFormProps = {
    confirmationResult: firebase.default.auth.ConfirmationResult
}

export const OTPForm: React.VFC<IOtpFormProps> = () => {
    return (
        <form>
            <input type="text" placeholder="123456"></input>
            <button type="submit">ยืนยัน</button>
        </form>
    )
}
