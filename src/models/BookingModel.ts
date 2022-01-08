import 'reflect-metadata'
import { DocumentReference, getDoc } from 'firebase/firestore'
import { Exclude, Type } from 'class-transformer'

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
    getUser = async (): Promise<UserModel> => {
        return (await getDoc(this.user)).data()
    }

    getProduct = async (): Promise<ProductModel> => {
        return (await getDoc(this.product)).data()
    }

    @Exclude({ toPlainOnly: true })
    product: DocumentReference<ProductModel>

    @Exclude({ toPlainOnly: true })
    user: DocumentReference<UserModel>

    createdOn: Date

    expiredOn: Date

    status: BookingStatus

    @Type(() => BookingMetadataModel)
    metadata: BookingMetadataModel
}
