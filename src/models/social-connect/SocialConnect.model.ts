import { DocumentReference } from 'firebase/firestore'
import { JsonProperty, JsonObject } from 'typescript-json-serializer'
import { UserModel } from '../UserModel'

@JsonObject()
export class SocialConnectModel {
    @JsonProperty()
    id: string

    @JsonProperty()
    createdOn: Date

    @JsonProperty()
    updatedOn: Date

    @JsonProperty()
    isActive: boolean

    @JsonProperty()
    user: FirebaseFirestore.DocumentReference<UserModel> | DocumentReference<UserModel>
}
