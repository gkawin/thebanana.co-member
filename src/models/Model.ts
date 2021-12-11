import {
    CollectionReference,
    DocumentData,
    DocumentReference,
    FieldValue,
    FirestoreDataConverter,
    PartialWithFieldValue,
    QueryDocumentSnapshot,
    Timestamp,
    WithFieldValue,
} from '@firebase/firestore'
import { instanceToPlain, plainToClass } from 'class-transformer'

interface ClassType<T> {
    new (...args: any[]): T
}

export default class Model {
    static _converter(data: DocumentData) {
        return Object.entries(data).reduce((acc, [key, value]) => {
            if (value instanceof Timestamp || Object.keys(value).includes('_seconds')) {
                acc = { ...acc, [key]: value.toDate() }
            } else if (value instanceof DocumentReference) {
                acc = { ...acc, [key]: value.id }
            } else if (value instanceof CollectionReference) {
                acc = { ...acc, [key]: value.id }
            } else if (Array.isArray(value)) {
                const mapped = value.map((v) => {
                    if (v instanceof DocumentReference || v instanceof CollectionReference) {
                        return v.id
                    }
                    return v
                })
                acc = { ...acc, [key]: mapped }
            } else {
                acc = { ...acc, [key]: value }
            }
            return acc
        }, {})
    }

    static convert<T>(target: ClassType<T>): FirestoreDataConverter<T> {
        return {
            toFirestore: (modelObject: WithFieldValue<T> | PartialWithFieldValue<T>) => {
                return instanceToPlain(modelObject, { exposeUnsetFields: false })
            },
            fromFirestore: (ss) => {
                const data = ss.data()
                const id = ss.id
                const o = Model._converter(data)
                return plainToClass(target, { id, ...o })
            },
        }
    }
    static transform = <T>(target: ClassType<T>): FirebaseFirestore.FirestoreDataConverter<T> => ({
        toFirestore: (modelObject) => {
            return instanceToPlain(modelObject)
        },
        fromFirestore: (ss) => {
            const data = ss.data()
            const o = Model._converter(data)
            const id = ss.id
            return plainToClass(target, { id, ...o })
        },
    })
}
