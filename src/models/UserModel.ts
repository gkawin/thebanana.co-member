// import { JsonProperty, Serializable } from 'typescript-json-serializer'

// import { withServerTimestampToISO } from '@/utils/firestore'

// import Model from './Model'
// import type { UserParentModel } from './UserParentModel'
// import type { UserSchoolModel } from './UserSchoolModel'
// import type { UserSocialModel } from './UserSocialModel'

// @Serializable()
// export class UserModel extends Model {
//     @JsonProperty() email: string

//     @JsonProperty({ beforeDeserialize: withServerTimestampToISO })
//     createdOn: string | FirebaseFirestore.FieldValue

//     @JsonProperty() id: string

//     @JsonProperty() nickname: string

//     @JsonProperty() verified: boolean

//     @JsonProperty() phoneNumber: string

//     @JsonProperty() fullname: string

//     @JsonProperty() address?: string

//     @JsonProperty() sms?: string

//     @JsonProperty() socials?: UserSocialModel[]

//     @JsonProperty() parents?: UserParentModel[]

//     @JsonProperty() school?: UserSchoolModel

//     @JsonProperty() pictureURL: string
// }
