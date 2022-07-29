import { withISOToServerTimestamp, withTimeToDate } from '@/utils/firestore'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { UserParentModel } from './UserParentModel'
import { UserSchoolModel } from './UserSchoolModel'
import { UserSocialModel } from './UserSocialModel'

@Serializable()
export class UserModel {
    @JsonProperty()
    email: string

    @JsonProperty({ beforeDeserialize: withTimeToDate, afterSerialize: withISOToServerTimestamp })
    createdOn: Date

    @JsonProperty()
    id: string

    @JsonProperty()
    nickname: string

    @JsonProperty()
    verified: boolean

    @JsonProperty()
    phoneNumber: string

    @JsonProperty()
    fullname: string

    @JsonProperty()
    address?: string

    @JsonProperty()
    sms?: string

    @JsonProperty({ type: () => UserSocialModel })
    socials?: UserSocialModel[]

    @JsonProperty({ type: () => UserParentModel })
    parents?: UserParentModel[]

    @JsonProperty()
    school?: UserSchoolModel

    @JsonProperty()
    pictureURL: string
}
