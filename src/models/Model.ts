import 'reflect-metadata'
import {
    DocumentData,
    FirestoreDataConverter,
    PartialWithFieldValue,
    Timestamp,
    WithFieldValue,
} from '@firebase/firestore'
import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer'

interface ClassType<T> {
    new (...args: any[]): T
}

const transformDocumentReference = (value: any) => {
    return value?.path ?? value
}

const transformTimestamp = (value: any) => {
    if (typeof value === 'object') {
        if ('_seconds' in value || 'seconds' in value) {
            return (value as unknown as Timestamp).toDate()
        }
        return value
    }
    return value
}

export default class Model {
    static _converter(data: DocumentData) {
        const result = Object.entries(data).reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
                const mapped = value.map((v) => transformDocumentReference(transformTimestamp(v)))
                acc = { ...acc, [key]: mapped }
                return acc
            }

            acc = { ...acc, [key]: transformDocumentReference(transformTimestamp(value)) }
            return acc
        }, {})

        return result
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
                return plainToInstance(target, { id, ...o })
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
