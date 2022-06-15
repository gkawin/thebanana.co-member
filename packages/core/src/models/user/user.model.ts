import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { UserStatus } from '../../constants'

@Serializable()
export class UserModelV2 {
    @JsonProperty()
    createdAt: Date

    @JsonProperty()
    socialId: string

    @JsonProperty()
    platform: string

    @JsonProperty()
    phoneNumber: string

    @JsonProperty()
    email: string

    @JsonProperty()
    status: UserStatus

    @JsonProperty()
    updatedAt: Date

    @JsonProperty()
    firstname: string

    @JsonProperty()
    lastname: string

    @JsonProperty()
    nickname?: string

    get fullname() {
        return this.firstname + ' ' + this.lastname
    }
}
