import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentCardModel {
    @JsonProperty()
    id: string

    @JsonProperty()
    financing: string

    @JsonProperty()
    country: string

    @JsonProperty()
    bank: string

    @JsonProperty()
    brand: string

    @JsonProperty()
    name: string

    @JsonProperty({ name: 'expiration_month' })
    expirationMonth: string

    @JsonProperty({ name: 'expiration_year' })
    expirationYear: string

    @JsonProperty({ name: 'created_at' })
    createdAt: string
}
