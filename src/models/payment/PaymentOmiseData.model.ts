import { JsonProperty, JsonObject } from 'typescript-json-serializer'
import { PaymentCardModel } from './PaymentCard.model'
import { PaymentDataSourceModel } from './PaymentDataSource.model'
import { PaymentMetadataModel } from './PaymentMetadata.model'

@JsonObject()
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
    metadata: PaymentMetadataModel

    @JsonProperty()
    description: string

    @JsonProperty()
    source?: PaymentDataSourceModel

    @JsonProperty()
    card?: PaymentCardModel

    @JsonProperty()
    status: 'successful' | 'failed' | 'pending'

    @JsonProperty({ name: 'failure_message' })
    failureMessage: string

    @JsonProperty({ name: 'failure_code' })
    failureCode: string
}
