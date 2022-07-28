import { ErrorCode } from '@/constants'

export class OTPError extends Error {
    code: string
    constructor(payload: { code: ErrorCode; message: string; cause?: Error }) {
        super(payload.message, { cause: payload.cause })
        this.code = payload.code
        this.message = payload.message
        this.cause = payload.cause
    }
    static INVALID_OTP = (customMsg?: string) =>
        new OTPError({ code: ErrorCode.INVALID_OTP, message: customMsg ?? super.prototype.message })
}
