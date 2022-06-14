import {
    CourseModel,
    UserModelV2,
    ClassInstance,
    SubjectModel,
    UserAddressModel,
    UserSchoolModel,
    BookingModel,
} from '@thebanana-members/core/lib/models'

import Model from '@thebanana-members/core/lib/models/Model'
import { collection, doc, Firestore, query } from 'firebase/firestore'

const queryCollection =
    <T>(name: string, TargetClass: ClassInstance<T>) =>
    (db: Firestore, ...segments: string[]) =>
        query(collection(db, name, ...segments)).withConverter(Model.convert(TargetClass))

const docData =
    <T>(name: string, TargetClass: ClassInstance<T>) =>
    (db: Firestore, ...segments: string[]) =>
        doc(db, name, ...segments).withConverter(Model.convert(TargetClass))

export const courseCollection = queryCollection('courses', CourseModel)

export const userCollection = queryCollection('users', UserModelV2)
export const userDoc = docData('users', UserModelV2)

export const subjectCollection = queryCollection('subjects', SubjectModel)

export const addrCollection = (db: Firestore, userId: string) =>
    queryCollection('users', UserAddressModel)(db, userId, 'address')

export const schoolCollection = (db: Firestore, userId: string) =>
    queryCollection('users', UserSchoolModel)(db, userId, 'school')

export const bookingCollection = queryCollection('booking', BookingModel)
