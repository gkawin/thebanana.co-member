import type { CheckoutFormField } from '@/pages/purchase/[slug]'
import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentEventBodyModel {
    @JsonProperty()
    key: string

    @JsonProperty()
    created_at: string

    @JsonProperty()
    id: string

    @JsonProperty()
    data: {
        object: string
        id: string
        amount: number
        net: number
        fee: number
        fee_vat: number
        interest: number
        interest_vat: number
        funding_amount: number
        refunded_amount: number
        transaction_fees: { fee_flat: string; fee_rate: string; vat_rate: string }
        metadata: CheckoutFormField
        description: string
    }
}
