import { UserParentModel } from './UserParentModel'
import { UserSchoolModel } from './UserSchoolModel'
import { UserSocialModel } from './UserSocialModel'

export class UserModel {
    email: string

    createdOn: Date

    id: string

    nickname: string

    verified: boolean

    phoneNumber: string

    fullname: string

    address?: string

    sms?: string

    socials?: UserSocialModel[]

    parents?: UserParentModel[]

    school?: UserSchoolModel

    pictureURL: string
}
