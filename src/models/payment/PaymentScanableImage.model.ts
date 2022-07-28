import { JsonProperty, JsonObject } from 'typescript-json-serializer'

@JsonObject()
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
