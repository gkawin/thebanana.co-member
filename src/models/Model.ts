import { classToPlain, plainToClass } from 'class-transformer'
import { FirestoreDataConverter, CollectionReference, DocumentReference, Timestamp } from 'firebase/firestore'

interface ClassType<T> {
    new (...args: any[]): T
}

export default class Model {
    static convert<T>(target: ClassType<T>): FirestoreDataConverter<T> {
        return {
            toFirestore: (modelObject) => {
                return classToPlain(modelObject, { exposeUnsetFields: false })
            },
            fromFirestore: (ss) => {
                const { courses: _, ...props } = ss.data()
                return plainToClass(target, props)
            },
        }
    }
    static transform = <T>(target: ClassType<T>): FirebaseFirestore.FirestoreDataConverter<T> => ({
        toFirestore: (modelObject) => {
            return classToPlain(modelObject)
        },
        fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot<T>) => {
            const data = snapshot.data()

            const o = Object.entries(data).reduce((acc, [key, value]) => {
                if (value instanceof Timestamp) {
                    acc = { ...acc, [key]: value.toDate() }
                } else if (value instanceof DocumentReference) {
                    acc = { ...acc, [key]: value.id }
                } else if (value instanceof CollectionReference) {
                    acc = { ...acc, [key]: value.id }
                } else {
                    acc = { ...acc, [key]: value }
                }
                return acc
            }, {})

            return plainToClass(target, o)
        },
    })
}
