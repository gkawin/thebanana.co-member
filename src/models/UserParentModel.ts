import { Timestamp } from '@firebase/firestore'
import { Transform } from 'class-transformer'

export class UserParentModel {
    email: string

    occupation: string

    fullname: string

    phoneNumber: string

    @Transform(({ value }) => {
        return value instanceof Timestamp ? value.toDate().toISOString() : value
    })
    createdOn: string
}
