import { withDocumentReferenceToPath, withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { JsonProperty, Serializable } from 'typescript-json-serializer'

import { DocumentReference as ClientDocRef } from 'firebase/firestore'
import { DocumentReference } from 'firebase-admin/firestore'

export class CourseModel {
    name: string
    seats: number
    semaster: string
}

@Serializable()
export class ProductModel {
    @JsonProperty()
    id: string

    @JsonProperty()
    code: string

    @JsonProperty()
    name: string

    @JsonProperty({ afterSerialize: withDocumentReferenceToPath })
    courses: DocumentReference<CourseModel>[] & ClientDocRef<CourseModel>[]

    @JsonProperty()
    description: string

    @JsonProperty()
    coverImage: string

    @JsonProperty()
    slug: string

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    effectiveDate: Date

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    expiredDate: Date

    @JsonProperty()
    price: number

    get pricing(): string {
        return `${(this.price || 0).toLocaleString('th', { minimumFractionDigits: 2, minimumIntegerDigits: 2 })} บาท`
    }

    get startedDate() {
        return this.effectiveDate.toISOString()
    }

    get endDate() {
        return this.expiredDate.toISOString()
    }
}
