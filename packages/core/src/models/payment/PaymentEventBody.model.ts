import { IsEnum, IsString } from 'class-validator'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { OmiseHookEvent } from '../../constants'
import { PaymentOmiseDataModel } from './PaymentOmiseData.model'

@Serializable()
export class PaymentEventBodyModel {
    @JsonProperty()
    @IsEnum(OmiseHookEvent)
    key: OmiseHookEvent

    @JsonProperty()
    @IsString()
    created_at: string

    @JsonProperty()
    @IsString()
    id: string

    @JsonProperty()
    data: PaymentOmiseDataModel
}
