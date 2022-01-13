import { withDocumentReferenceToPath, withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import Model from './Model'
export class CourseModel {
    name: string
}

@Serializable()
export class ProductModel extends Model {
    @JsonProperty()
    id: string

    @JsonProperty()
    code: string

    @JsonProperty()
    name: string

    @JsonProperty({ beforeDeserialize: withDocumentReferenceToPath })
    courseIds: string[]

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

    get startedDate() {
        return this.effectiveDate.toISOString()
    }

    get endDate() {
        return this.expiredDate.toISOString()
    }
}
