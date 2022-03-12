export enum DatasetType {
    EXISITING = 'EXISITING',
    CREATED_NEW = 'CREATED_NEW',
}

export enum BookingStatus {
    PAYMENT = 'PAYMENT',
    CHECKOUT = 'CHECKOUT',
    PAID = 'PAID',
    EXPIRED = 'EXPIRED',
    ERROR = 'ERROR',
    CREATED = 'CREATED',
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
