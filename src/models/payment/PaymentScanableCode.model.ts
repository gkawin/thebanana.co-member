import { JsonProperty, JsonObject } from 'typescript-json-serializer'
import { PaymentScanableImageModel } from './PaymentScanableImage.model'

@JsonObject()
export class PaymentScanableCodeModel {
    @JsonProperty()
    object: string

    @JsonProperty()
    type: string

    @JsonProperty()
    image: PaymentScanableImageModel
}
