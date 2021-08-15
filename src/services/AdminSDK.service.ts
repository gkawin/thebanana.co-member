import { injectable } from 'tsyringe'
import type admin from 'firebase-admin'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { UserModel } from '@/models/UserModel'
import { UserConnectModel } from '@/models/UserConnectModel'

@injectable()
export class AdminSDKService {
    static sdk: typeof admin | admin.app.App

    constructor() {
        if (!AdminSDKService.sdk) {
            AdminSDKService.sdk = adminSDK()
            console.log('injected admin SDK')
        }
    }

    private get sdk() {
        return AdminSDKService.sdk
    }

    get userModel() {
        return this.sdk.firestore().collection('users').withConverter(Model.transform(UserModel))
    }

    get socialModel() {
        return this.sdk.firestore().collection('users_connect').withConverter(Model.transform(UserConnectModel))
    }

    getUserByPhoneNumber(phoneNumber: string) {
        return this.sdk.auth().getUserByPhoneNumber(phoneNumber)
    }

    generateAccessTokenBySocialId(socialId: string) {
        return this.sdk.auth().createCustomToken(socialId)
    }
}
