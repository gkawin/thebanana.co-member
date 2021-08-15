import { getServerTimestamp } from '@/libs/adminSDK'
import { UserConnectModel } from '@/models/UserConnectModel'
import { AdminSDKService } from '@/services/AdminSDK.service'
import { mobileToThaiNumber } from '@/utils/phone-number'
import { injectable } from 'tsyringe'

@injectable()
export class LoginService {
    constructor(private sdk: AdminSDKService) {}

    async findUserByUserId(userId: string) {
        const result = await this.sdk.userModel.doc(userId).get()
        return result.data()
    }

    async getSocialInfo(socialId: string): Promise<UserConnectModel> {
        try {
            const socialInfo = await this.sdk.socialModel
                .where('channelType', '==', 'line')
                .where('socialId', '==', socialId)
                .where('status', '==', true)
                .limit(1)
                .get()
            return socialInfo.docs.map((v) => v.data())[0]
        } catch (error) {
            return null
        }
    }

    async generateLoginToken(socialId: string) {
        try {
            const result = await this.sdk.generateAccessTokenBySocialId(socialId)
            return result
        } catch (error) {
            return null
        }
    }

    async connectSocial(phoneNumber: string, socialId: string, payload: UserConnectModel) {
        try {
            const phoneTH = mobileToThaiNumber(phoneNumber)
            const IAM = await this.sdk.getUserByPhoneNumber(phoneTH)

            const userInfo = await this.sdk.userModel
                .where('phoneNumber', '==', phoneTH)
                .orderBy('createdOn', 'desc')
                .limit(1)
                .get()

            const socialInfo = await this.sdk.socialModel
                .where('channelType', '==', 'line')
                .where('socialId', '==', socialId)
                .get()

            if (userInfo.empty) {
                await this.sdk.userModel.doc(IAM.uid).create({
                    phoneNumber: phoneTH,
                    createdOn: getServerTimestamp(),
                    fullname: IAM.displayName,
                    pictureURL: IAM.photoURL,
                    verified: false,
                    email: IAM.email,
                    id: IAM.uid,
                    address: null,
                    nickname: '',
                    parents: [],
                    school: null,
                    socials: [],
                    sms: null,
                })
            }
        } catch (error) {
            console.error(error)
        }
    }
}
