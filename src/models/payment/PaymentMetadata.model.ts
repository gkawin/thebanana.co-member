import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentMetadata {
    @JsonProperty()
    bookingCode: string

    @JsonProperty()
    effectiveDate: Date

    @JsonProperty()
    expiredDate: Date

    @JsonProperty()
    productId: string

    @JsonProperty()
    userId: string
}
