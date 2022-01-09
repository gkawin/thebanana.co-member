import { DocumentReference } from 'firebase/firestore'
import { UserModel } from './UserModel'
import { ProductModel } from './ProductModel'
import { JsonProperty, Serializable } from 'typescript-json-serializer'

export enum BookingStatus {
    WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
    PAID = 'PAID',
    EXPIRED = 'EXPIRED',
}

export class BookingMetadataModel {
    studentName: string
    schoolName: string
    nickname: string
}

@Serializable()
export class BookingModel {
    @JsonProperty()
    product:
        | FirebaseFirestore.DocumentReference<ProductModel>
        | DocumentReference<ProductModel>
        | Promise<ProductModel>
        | ProductModel

    @JsonProperty()
    user: FirebaseFirestore.DocumentReference<UserModel> | DocumentReference<UserModel> | Promise<UserModel> | UserModel
    @JsonProperty()
    createdOn: Date
    @JsonProperty()
    expiredOn: Date
    @JsonProperty()
    status: BookingStatus

    @JsonProperty({ type: () => BookingMetadataModel })
    metadata: BookingMetadataModel
}
