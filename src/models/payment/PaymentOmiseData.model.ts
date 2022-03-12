import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { PaymentDataSourceModel } from './PaymentDataSource.model'
import { PaymentMetadata } from './PaymentMetadata.model'

@Serializable()
export class PaymentOmiseDataModel {
    @JsonProperty()
    object: string

    @JsonProperty()
    id: string

    @JsonProperty()
    amount: number

    @JsonProperty()
    net: number

    @JsonProperty()
    fee: number

    @JsonProperty()
    fee_vat: number

    @JsonProperty()
    interest: number

    @JsonProperty()
    interest_vat: number

    @JsonProperty()
    funding_amount: number

    @JsonProperty()
    refunded_amount: number

    @JsonProperty()
    transaction_fees: { fee_flat: string; fee_rate: string; vat_rate: string }

    @JsonProperty()
    metadata: PaymentMetadata

    @JsonProperty()
    description: string

    @JsonProperty()
    source?: PaymentDataSourceModel
}
