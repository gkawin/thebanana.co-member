import { Type } from 'class-transformer'
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

    @Type(() => UserParentModel)
    socials?: UserSocialModel[]

    @Type(() => UserParentModel)
    parents?: UserParentModel[]

    @Type(() => UserSchoolModel)
    school?: UserSchoolModel

    pictureURL: string
}
