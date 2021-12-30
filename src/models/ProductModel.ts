import 'reflect-metadata'
import { Timestamp } from 'firebase/firestore'
import { Exclude, Expose, Transform } from 'class-transformer'

export class CourseModel {
    name: string
}

export class ProductModel {
    id: string

    code: string

    name: string

    courses: string[]

    description: string

    @Transform(({ value }) => (!value ? null : value))
    rating: number

    coverImage: string

    slug: string

    @Transform(({ value }) => (value instanceof Timestamp ? value.toDate() : value))
    @Exclude({ toPlainOnly: true })
    effectiveDate: Date

    @Transform(({ value }) => (value instanceof Timestamp ? value.toDate() : value))
    @Exclude({ toPlainOnly: true })
    expiredDate: Date

    price: number

    @Expose({ toPlainOnly: true })
    get pricing(): string {
        return `${(this.price || 0).toLocaleString('th', { minimumFractionDigits: 2, minimumIntegerDigits: 2 })} บาท`
    }

    @Expose({ toPlainOnly: true })
    get startedDate() {
        return this.effectiveDate.toISOString()
    }

    @Expose({ toPlainOnly: true })
    get endDate() {
        return this.expiredDate.toISOString()
    }
}
