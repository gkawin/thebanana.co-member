import { JsonProperty, Serializable } from 'typescript-json-serializer'

import { withServerTimestampToISO } from '@/utils/firestore'

import Model from './Model'

export interface IUserConnect {
    updated: string | FirebaseFirestore.FieldValue
    createdOn: string | FirebaseFirestore.FieldValue
    status: boolean
    channelType: string
    channelId: string
    subscribed: boolean
}

@Serializable()
export class UserConnectModel extends Model implements IUserConnect {
    updated: string | FirebaseFirestore.Timestamp
    @JsonProperty() deviceOS: 'ios' | 'web' | 'android'

    @JsonProperty() socialId: string

    @JsonProperty() status: boolean

    @JsonProperty({ beforeDeserialize: withServerTimestampToISO }) updatedOn: string | FirebaseFirestore.FieldValue

    @JsonProperty({ beforeDeserialize: withServerTimestampToISO }) createdOn: string | FirebaseFirestore.FieldValue

    @JsonProperty() channelType: 'line'

    @JsonProperty() channelId: string

    @JsonProperty() subscribed: boolean
}
