import 'reflect-metadata'
import { Expose, Transform } from 'class-transformer'
import { Timestamp } from 'firebase/firestore'

export class CourseModel {
    name: string
}

export class ProductModel {
    code: string

    name: string

    courses: string[]

    @Transform(({ value }) => (value instanceof Timestamp ? value.toDate() : value))
    effectiveDate: Date
    @Transform(({ value }) => (value instanceof Timestamp ? value.toDate() : value))
    expiredDate: Date

    price: number

    @Expose()
    get pricing(): string {
        return `${(this.price || 0).toLocaleString('th', { minimumFractionDigits: 2, minimumIntegerDigits: 2 })} บาท`
    }
}
