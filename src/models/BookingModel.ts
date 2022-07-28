import { DocumentReference } from 'firebase/firestore'
import { UserModel } from './UserModel'
import { JsonObject, JsonProperty } from 'typescript-json-serializer'
import { withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { BookingStatus, FailureCode, PaymentMethod, SourceOfFund } from '@/constants'
import dayjs from 'dayjs'
import { UserAddressModel } from './UserAddressModel'
import { CourseModel } from './course/course.model'

@JsonObject()
export class ReceiptModel {
    @JsonProperty()
    receiptId: string
    @JsonProperty()
    downloadable: boolean
    @JsonProperty()
    filepath: string
    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    createdAt: Date
}

@JsonObject()
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
    course: FirebaseFirestore.DocumentReference<CourseModel> | DocumentReference<CourseModel>

    @JsonProperty()
    user: FirebaseFirestore.DocumentReference<UserModel> | DocumentReference<UserModel>

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    createdOn: Date

    @JsonProperty()
    status: BookingStatus

    @JsonProperty()
    failureCode: FailureCode

    @JsonProperty()
    shippingAddress: FirebaseFirestore.DocumentReference<UserAddressModel> | DocumentReference<UserAddressModel>

    @JsonProperty()
    paymentMethod: PaymentMethod

    @JsonProperty()
    price: number

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    startDate: Date

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    endDate: Date

    @JsonProperty()
    receipt?: ReceiptModel
}
