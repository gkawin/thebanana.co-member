import { Timestamp } from '@firebase/firestore'
import { Transform } from 'class-transformer'

export class UserSchoolModel {
    grade: string

    nextSchool: string

    school: string

    @Transform(({ value }) => {
        return value instanceof Timestamp ? value.toDate().toISOString() : value
    })
    createdOn: string
}
