import { DatasetType } from '@/constants'
import { CheckoutFormField } from '@/pages/purchase/[slug]'
import { IsEnum, IsString, ValidateIf } from 'class-validator'
import { JsonProperty, Serializable } from 'typescript-json-serializer'

@Serializable()
export class PaymentChargeBody implements CheckoutFormField {
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
    @IsString()
    paymentMethod: 'BANK_TRANSFER' | 'PROMPT_PAY' | 'CREDIT_CARD'

    @JsonProperty()
    @IsString()
    productId: string

    @JsonProperty()
    @IsString()
    userId: string

    @JsonProperty()
    @ValidateIf((o: PaymentChargeBody) => o.token !== null)
    @IsString()
    token: string

    @JsonProperty()
    @ValidateIf((o: PaymentChargeBody) => o.source !== null)
    source: string
}
