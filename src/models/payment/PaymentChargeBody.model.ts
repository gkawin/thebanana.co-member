import { DatasetType, PaymentMethod } from '@/constants'
import { CheckoutFormField } from '@/pages/purchase/[slug]'
import { IsEnum, IsString, ValidateIf } from 'class-validator'
import { JsonProperty, JsonObject } from 'typescript-json-serializer'

@JsonObject()
export class PaymentChargeBodyModel implements CheckoutFormField {
    @JsonProperty()
    @IsString()
    studentName: string

    @JsonProperty()
    @IsString()
    school: string

    @JsonProperty()
    @IsString()
    nickname: string

    @JsonProperty()
    @IsString()
    shippingAddressId: string

    @JsonProperty()
    @IsEnum(DatasetType)
    datasetType: DatasetType

    @JsonProperty()
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod

    @JsonProperty()
    @IsString()
    productId: string

    @JsonProperty()
    @IsString()
    userId: string

    @JsonProperty()
    @ValidateIf((o: PaymentChargeBodyModel) => o.token !== null)
    @IsString()
    token: string

    @JsonProperty()
    @ValidateIf((o: PaymentChargeBodyModel) => o.source !== null)
    source: string
}
