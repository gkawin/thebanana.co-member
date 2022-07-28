import { JsonProperty, JsonObject } from 'typescript-json-serializer'

@JsonObject()
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

    @JsonProperty()
    productCode: string

    @JsonProperty()
    price: number

    @JsonProperty()
    startDate: Date

    @JsonProperty()
    endDate: Date
}
