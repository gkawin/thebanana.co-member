import { Timestamp } from 'firebase/firestore'
import { Transform } from 'class-transformer'

export class UserAddressModel {
    address: string

    @Transform(({ value }) => {
        return value instanceof Timestamp ? value.toDate().toISOString() : value
    })
    createdOn: Date
}
