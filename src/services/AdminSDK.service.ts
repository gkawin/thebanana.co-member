import { injectable } from 'tsyringe'
import type admin from 'firebase-admin'
import adminSDK from '@/libs/adminSDK'

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

    get db() {
        return this.sdk.firestore()
    }

    get auth() {
        return this.sdk.auth()
    }

    getUserByPhoneNumber(phoneNumber: string) {
        return this.sdk.auth().getUserByPhoneNumber(phoneNumber)
    }

    generateAccessTokenBySocialId(socialId: string) {
        return this.sdk.auth().createCustomToken(socialId)
    }
}
