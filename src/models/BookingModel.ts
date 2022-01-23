import { DocumentReference } from 'firebase/firestore'
import { UserModel } from './UserModel'
import { ProductModel } from './ProductModel'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { BookingStatus } from '@/constants'

@Serializable()
export class BookingModel {
    static generateBookingCode = () =>
        `${(process.pid * new Date().getTime())
            .toString(32)
            .toUpperCase()
            .split('')
            .sort(function () {
                return 0.5 - Math.random()
            })
            .join('')}`

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
    metadata: Record<string, any>
}
