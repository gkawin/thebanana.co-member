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
