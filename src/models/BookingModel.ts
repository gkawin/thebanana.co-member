import { DocumentReference } from 'firebase/firestore'
import { UserModel } from './UserModel'
import { ProductModel } from './ProductModel'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { BookingStatus, PaymentMethod, SourceOfFund } from '@/constants'
import dayjs from 'dayjs'
import { PaymentMetadataModel } from './payment/PaymentMetadata.model'
import { PaymentScanableImageModel } from './payment/PaymentScanableImage.model'
import { UserAddressModel } from './UserAddressModel'

@Serializable()
export class BookingModel {
    static generateBookingCode = () => {
        const day = parseInt(dayjs().format('YYMMDD'), 10)
        const min = 100_000_000
        const max = 999_999_000
        const random = Math.floor(Math.random() * (max - min) + min)
        return `${day}-${random}`
    }
    @JsonProperty()
    bookingCode: string

    @JsonProperty()
    billingId: string

    @JsonProperty()
    sourceOfFund: SourceOfFund

    @JsonProperty()
    product: FirebaseFirestore.DocumentReference<ProductModel> | DocumentReference<ProductModel>

    @JsonProperty()
    user: FirebaseFirestore.DocumentReference<UserModel> | DocumentReference<UserModel>

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    createdOn: Date

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    expiredOn: Date

    @JsonProperty()
    status: BookingStatus

    @JsonProperty()
    shippingAddress: FirebaseFirestore.DocumentReference<UserAddressModel> | DocumentReference<UserAddressModel>

    @JsonProperty()
    paymentMethod: PaymentMethod

    @JsonProperty({
        predicate: (p) => {
            if (p?.type === 'qr') {
                return PaymentScanableImageModel
            }
            return null
        },
    })
    scannableCode?: PaymentScanableImageModel | null
}
