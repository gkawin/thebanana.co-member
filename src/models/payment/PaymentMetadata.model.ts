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
    enrollmentAt: Date

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
