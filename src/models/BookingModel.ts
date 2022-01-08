import 'reflect-metadata'
import { DocumentReference, getDoc } from 'firebase/firestore'
import { Exclude, Transform, Type } from 'class-transformer'

import { UserModel } from './UserModel'
import { ProductModel } from './ProductModel'

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
    @Exclude({ toPlainOnly: true })
    @Type(() => ProductModel)
    @Transform(({ value }) => {
        return value instanceof DocumentReference ? getDoc(value).then((v) => v.data()) : value
    })
    product: DocumentReference<ProductModel> | Promise<ProductModel> | ProductModel

    @Exclude({ toPlainOnly: true })
    @Type(() => UserModel)
    @Transform(({ value }) => {
        return value instanceof DocumentReference ? getDoc(value).then((v) => v.data()) : value
    })
    user: DocumentReference<UserModel> | Promise<UserModel> | UserModel

    createdOn: Date

    expiredOn: Date

    status: BookingStatus

    @Type(() => BookingMetadataModel)
    metadata: BookingMetadataModel
}
