import 'reflect-metadata'
import { Timestamp } from '@firebase/firestore'
import { Transform, Type } from 'class-transformer'

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

    @Type(() => BookingMetadataModel)
    metadata: BookingMetadataModel
}
