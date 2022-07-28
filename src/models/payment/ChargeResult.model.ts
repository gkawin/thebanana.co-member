import { PaymentMethod } from '@/constants'
import { JsonProperty, JsonObject } from 'typescript-json-serializer'
import { PaymentCardModel } from './PaymentCard.model'
import { PaymentScanableImageModel } from './PaymentScanableImage.model'

@JsonObject()
export class ChargeResultModel {
    @JsonProperty()
    bookingCode: string

    @JsonProperty()
    status: 'pending' | 'failed' | 'successful'

    @JsonProperty()
    paymentMethod: PaymentMethod

    @JsonProperty()
    card?: PaymentCardModel

    @JsonProperty()
    qrCode?: PaymentScanableImageModel

    @JsonProperty()
    failureMessage?: string

    @JsonProperty()
    failureCode?: string

    @JsonProperty({ isDictionary: true })
    metadata?: {
        productCode: string
        productName: string
        effectiveDate: Date
        startDate: Date
        endDate: Date
        description: string
    } & Record<string, any>
}
