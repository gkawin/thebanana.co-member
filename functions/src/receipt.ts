import { readFileSync } from 'fs'
import path from 'path'
import Handlebars from 'handlebars'

export type ReceiptTemplateProps = {
    parentName: string
    address: string
    buyerTaxId?: string
    receiptId: string
    createdAt: string
    totalPricing: string
    totalPricingThai: string
    listCoursesEnrolled: { uid?: string; course: string; session: string; pricing: number }[]
    isShownBuyerTaxId: boolean
    studentName: string
    nickname: string
    paymentMethodLabel: string
}

Handlebars.registerHelper('math', function (lvalue, operator, rvalue): any {
    lvalue = parseFloat(lvalue)
    rvalue = parseFloat(rvalue)

    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue,
    }[operator]
})

export function generateReceiptFromHtml(payload: ReceiptTemplateProps) {
    const bufferString = readFileSync(path.resolve(__dirname, './html/receipt-template.handlebars'))
    const template = Handlebars.compile<ReceiptTemplateProps>(bufferString.toString('utf-8'))
    return template(payload)
}
