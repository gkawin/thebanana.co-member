export enum DatasetType {
    EXISITING = 'EXISITING',
    CREATED_NEW = 'CREATED_NEW',
}

export enum BookingStatus {
    PAID = 'PAID',
    CREATED = 'CREATED',
    EXPIRED = 'EXPIRED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}

export enum BookingGroup {
    UpComming,
    Past,
    Cancelled,
}

export enum PaymentStep {
    INIT,
    SELECT_PAYMENT_METHOD,
}

export enum PaymentMethod {
    BANK_TRANSFER = 'BANK_TRANSFER',
    PROMPT_PAY = 'PROMPT_PAY',
    CREDIT_CARD = 'CREDIT_CARD',
}

export const PaymentMethodLabel = new Map<PaymentMethod, string>([
    [PaymentMethod.BANK_TRANSFER, 'โอนเงินเข้าบัญชีธนาคาร'],
    [PaymentMethod.PROMPT_PAY, 'พร้อมเพย์'],
    [PaymentMethod.CREDIT_CARD, 'บัตรเครดิต/เดบิต'],
])

export enum SourceOfFund {
    OMISE = 'OMISE',
}

export enum OmiseHookEvent {
    CREATE = 'charge.create',
    COMPLETE = 'charge.complete',
}

export enum FailureCode {
    insufficient_fund,
    stolen_or_lost_card,
    failed_processing,
    payment_rejected,
    failed_fraud_check,
    invalid_account_number,
    invalid_security_code,
}

export const FailureMessage = new Map<FailureCode, string>([
    [FailureCode.insufficient_fund, 'ยอดเงินในบัตรเครดิตไม่เพียงพอ กรุณาติดต่อธนาคารเจ้าของบัตร'],
    [FailureCode.stolen_or_lost_card, 'ไม่สามารถทำรายการบนบัตรนี้ได้ กรุณาติดต่อธนาคารเจ้าของบัตร'],
    [FailureCode.failed_processing, 'ไม่สามารถทำรายการบนบัตรนี้ได้ กรุณาติดต่อธนาคารเจ้าของบัตร'],
    [FailureCode.payment_rejected, 'ไม่สามารถทำรายการบนบัตรนี้ได้ กรุณาติดต่อธนาคารเจ้าของบัตร'],
    [FailureCode.failed_fraud_check, 'ไม่สามารถทำรายการบนบัตรนี้ได้ กรุณาติดต่อธนาคารเจ้าของบัตร'],
    [FailureCode.invalid_account_number, 'กรุณากรอกเลขบนบัตรเครดิตให้ถูกต้อง ครบถ้วน'],
    [FailureCode.invalid_security_code, 'กรุณากรอกเลขบนบัตรเครดิตให้ถูกต้อง ครบถ้วน'],
])
