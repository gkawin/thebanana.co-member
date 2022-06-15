import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class UserAddressModel {
    @JsonProperty()
    address: string

    @JsonProperty()
    commonAddr: string

    @JsonProperty()
    createdAt: Date

    @JsonProperty()
    district: string

    @JsonProperty()
    phoneNumber: string

    @JsonProperty()
    postcode: string

    @JsonProperty()
    province: string

    @JsonProperty()
    subdistrict: string

    @JsonProperty()
    id: string
}
