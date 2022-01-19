export enum DatasetType {
    EXISITING = 'EXISITING',
    CREATED_NEW = 'CREATED_NEW',
}

export enum BookingStatus {
    PAYMENT = 'PAYMENT',
    CHECKOUT = 'CHECKOUT',
    PAID = 'PAID',
    EXPIRED = 'EXPIRED',
}

export enum PaymentStep {
    INIT,
    SELECT_PAYMENT_METHOD,
}

export enum PaymentMethod {
    BANK_TRANSFER = 'โอนเข้าบัญชี',
    PROMPT_PAY = 'พร้อมเพย์',
    CREDIT_CARD = 'บัตรเครดิต/เดบิต',
}
