import 'reflect-metadata'
import { Timestamp } from '@firebase/firestore'
import { Transform } from 'class-transformer'

export enum BookingStatus {
    WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
}

export class BookingModel {
    user: string

    product: string

    @Transform(({ value }) => {
        return value instanceof Timestamp ? value.toDate().toISOString() : value
    })
    createdOn: Date

    @Transform(({ value }) => (value instanceof Timestamp ? value.toDate().toISOString() : value))
    expiredOn: Date

    status: BookingStatus
}
