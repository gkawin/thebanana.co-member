import { DocumentReference } from 'firebase/firestore'
import { Serializable, JsonProperty } from 'typescript-json-serializer'
import { withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { BookingStatus, FailureCode, PaymentMethod, SourceOfFund } from '@/constants'
import dayjs from 'dayjs'
import { UserAddressModel } from './UserAddressModel'
import { CourseModel } from './course/course.model'
import { UserModelV2 } from './user/user.model'

@Serializable()
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
    course: FirebaseFirestore.DocumentReference<CourseModel> | DocumentReference<CourseModel>

    @JsonProperty()
    user: FirebaseFirestore.DocumentReference<UserModelV2> | DocumentReference<UserModelV2>

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

    @JsonProperty({ isDictionary: true })
    studentInfo: {
        nickname: string
        school: string
        studentName: string
    }

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    startDate: Date

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    endDate: Date

    @JsonProperty()
    receipt?: ReceiptModel
}
