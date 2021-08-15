import { JsonProperty, Serializable } from 'typescript-json-serializer'

import { withServerTimestampToISO } from '@/utils/firestore'

import Model from './Model'

@Serializable()
export class UserSchoolModel extends Model {
    @JsonProperty() grade: string

    @JsonProperty() nextSchool: string

    @JsonProperty() school: string

    @JsonProperty({ beforeDeserialize: withServerTimestampToISO })
    createdOn: string | FirebaseFirestore.Timestamp
}
