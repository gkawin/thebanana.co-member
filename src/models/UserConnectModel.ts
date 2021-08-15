import { JsonProperty, Serializable } from 'typescript-json-serializer'

import { withServerTimestampToISO } from '@/utils/firestore'

import Model from './Model'
import type { UserModel } from './UserModel'

export interface IUserConnect {
    user?: FirebaseFirestore.DocumentReference<UserModel> | null
    updated: string | FirebaseFirestore.Timestamp
    createdOn: string | FirebaseFirestore.Timestamp
    status: boolean
    channelType: string
    channelId: string
    subscribed: boolean
}

@Serializable()
export default class UserConnectModel extends Model implements IUserConnect {
    updated: string | FirebaseFirestore.Timestamp
    @JsonProperty() deviceOS: 'ios' | 'web' | 'android'

    @JsonProperty() socialId: string

    @JsonProperty() user: FirebaseFirestore.DocumentReference<UserModel>

    @JsonProperty() status: boolean

    @JsonProperty({ beforeDeserialize: withServerTimestampToISO }) updatedOn: string | FirebaseFirestore.Timestamp

    @JsonProperty({ beforeDeserialize: withServerTimestampToISO }) createdOn: string | FirebaseFirestore.Timestamp

    @JsonProperty() channelType: 'line'

    @JsonProperty() channelId: string

    @JsonProperty() subscribed: boolean
}
