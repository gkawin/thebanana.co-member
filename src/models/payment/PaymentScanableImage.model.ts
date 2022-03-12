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

    @JsonProperty({ name: 'download_uri' })
    downloadUri: string

    @JsonProperty({ name: 'created_at' })
    createdAt: string
}
