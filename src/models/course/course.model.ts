import { withDocumentReferenceToPath, withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { JsonProperty, Serializable } from 'typescript-json-serializer'

import { DocumentReference as ClientDocRef } from 'firebase/firestore'
import { DocumentReference } from 'firebase-admin/firestore'
import { SubjectModel } from './subject.model'

@Serializable()
export class CourseModel {
    @JsonProperty()
    id: string

    @JsonProperty()
    code: string

    @JsonProperty()
    title: string

    @JsonProperty({ afterSerialize: withDocumentReferenceToPath })
    subjects: DocumentReference<SubjectModel>[] & ClientDocRef<SubjectModel>[]

    @JsonProperty()
    description: string

    @JsonProperty()
    coverImage: string

    @JsonProperty()
    slug: string

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    enrollmentAt: Date

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    closeEnrollAt: Date

    @JsonProperty()
    price: number

    @JsonProperty()
    vat: number

    @JsonProperty()
    get pricing(): string {
        return `${(this.price || 0).toLocaleString('th', { minimumFractionDigits: 2, minimumIntegerDigits: 2 })} บาท`
    }

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    startDate: Date

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    endDate: Date

    @JsonProperty()
    isActive: boolean

    @JsonProperty()
    session: string
}
