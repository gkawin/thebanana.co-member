import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentScanableImageModel {
    @JsonProperty()
    id: string

    @JsonProperty()
    filename: string

    @JsonProperty()
    location: string

    @JsonProperty()
    kind: string

    @JsonProperty()
    download_uri: string

    @JsonProperty()
    created_at: string
}
