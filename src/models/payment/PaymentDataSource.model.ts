import { JsonProperty, JsonObject } from 'typescript-json-serializer'
import { PaymentScanableCodeModel } from './PaymentScanableCode.model'

@JsonObject()
export class PaymentDataSourceModel {
    @JsonProperty({ name: 'scannable_code' })
    scannableCode?: PaymentScanableCodeModel

    @JsonProperty()
    type: string
}
