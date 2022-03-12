import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { PaymentScanableImageModel } from './PaymentScanableImage.model'

@Serializable()
export class PaymentScanableCodeModel {
    @JsonProperty()
    object: string

    @JsonProperty()
    type: string

    @JsonProperty()
    image: PaymentScanableImageModel
}
