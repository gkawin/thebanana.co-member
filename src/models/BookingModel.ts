import { DocumentReference } from 'firebase/firestore'
import { UserModel } from './UserModel'
import { ProductModel } from './ProductModel'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { BookingStatus, SourceOfFund } from '@/constants'
import dayjs from 'dayjs'

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

    @JsonProperty({ isDictionary: true })
    metadata: Record<string, any>

    @JsonProperty({ isDictionary: true })
    source: Record<string, any>
}
