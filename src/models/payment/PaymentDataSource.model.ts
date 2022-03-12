import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentDataSourceModel {
    @JsonProperty()
    scannable_code?: {
        object: string
        id: string
        filename: string
    }
}
