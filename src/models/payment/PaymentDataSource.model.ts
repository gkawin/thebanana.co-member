import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { PaymentScanableCodeModel } from './PaymentScanableCode.model'

@Serializable()
export class PaymentDataSourceModel {
    @JsonProperty({ name: 'scannable_code' })
    scannableCode?: PaymentScanableCodeModel

    @JsonProperty()
    type: string
}
