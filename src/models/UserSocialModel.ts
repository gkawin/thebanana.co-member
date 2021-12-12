import { Timestamp } from '@firebase/firestore'
import { Transform } from 'class-transformer'

export class UserSocialModel {
    facebook?: string

    twitter?: string

    @Transform(({ value }) => {
        return value instanceof Timestamp ? value.toDate().toISOString() : value
    })
    createdOn?: string

    line?: string
}
