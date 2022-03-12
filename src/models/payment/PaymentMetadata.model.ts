import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentMetadataModel {
    @JsonProperty()
    bookingCode: string

    @JsonProperty()
    productId: string

    @JsonProperty()
    userId: string

    @JsonProperty()
    shippingAddressId: string

    @JsonProperty()
    effectiveDate: Date

    @JsonProperty()
    expiredDate: Date
}
