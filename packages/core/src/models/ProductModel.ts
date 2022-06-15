import { JsonProperty, Serializable } from 'typescript-json-serializer'

import { DocumentReference as ClientDocRef } from 'firebase/firestore'
import { DocumentReference } from 'firebase-admin/firestore'
import { withDocumentReferenceToPath, withISOToServerTimestamp, withTimeToDate } from '../utils/firestore'

@Serializable()
export class ProductModel {
    @JsonProperty()
    id: string

    @JsonProperty()
    code: string

    @JsonProperty()
    name: string

    @JsonProperty({ afterSerialize: withDocumentReferenceToPath })
    courses: DocumentReference<{
        name: string
        seats: number
        semaster: string
    }>[] &
        ClientDocRef<{
            name: string
            seats: number
            semaster: string
        }>[]

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
}
