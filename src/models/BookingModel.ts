import { DocumentReference } from 'firebase/firestore'
import { UserModel } from './UserModel'
import { ProductModel } from './ProductModel'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'

export enum BookingStatus {
    PAYMENT = 'PAYMENT',
    CHECKOUT = 'CHECKOUT',
    PAID = 'PAID',
    EXPIRED = 'EXPIRED',
}

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
    bookingCode: string

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
