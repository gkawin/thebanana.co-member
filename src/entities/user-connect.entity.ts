export class UserConnectEntity {
    deviceOS: 'ios' | 'web' | 'android'

    connectId: string

    isActive: boolean

    createdDate: Date

    platform: 'Line'

    channelId: string

    user: string
}
