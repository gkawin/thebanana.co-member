import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentMetadataModel {
    @JsonProperty()
    bookingCode: string

    @JsonProperty()
    courseId: string

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

    @JsonProperty({ isDictionary: true })
    studentInfo: {
        nickname: string
        school: string
        studentName: string
    }
}
