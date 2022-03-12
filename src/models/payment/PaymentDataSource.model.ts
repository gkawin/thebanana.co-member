import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { PaymentScanableCodeModel } from './PaymentScanableCode.model'

@Serializable()
export class PaymentDataSourceModel {
    @JsonProperty()
    scannable_code?: PaymentScanableCodeModel
}
