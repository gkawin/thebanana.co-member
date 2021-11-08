import 'reflect-metadata'
import { Timestamp } from '@firebase/firestore'
import { Transform } from 'class-transformer'

export enum BookingStatus {
    WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
}

export class BookingModel {
    userId: string

    productId: string

    @Transform(({ value }) => (value instanceof Timestamp ? value.toDate() : value))
    createdOn: Date

    @Transform(({ value }) => (value instanceof Timestamp ? value.toDate() : value))
    expiredOn: Date

    status: BookingStatus
}
