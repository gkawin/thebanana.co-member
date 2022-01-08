import 'reflect-metadata'
import {
    DocumentReference,
    FirestoreDataConverter,
    PartialWithFieldValue,
    Timestamp,
    WithFieldValue,
} from 'firebase/firestore'
import { instanceToPlain, plainToInstance } from 'class-transformer'

interface ClassType<T> {
    new (...args: any[]): T
}

const { TransformOperationExecutor } = require('class-transformer/esm5/TransformOperationExecutor')

TransformOperationExecutor.prototype.transform = (function (transform) {
    return function (source: any, value: any, targetType: any, arrayType: any, isMap: any, level: any) {
        if (value instanceof DocumentReference || value instanceof DocumentReference) {
            return value
        }

        if (value instanceof Timestamp || value instanceof Timestamp) {
            return value.toDate()
        }

        // @ts-ignore
        // tslint:disable-next-line:no-invalid-this
        return transform.apply(this, [source, value, targetType, arrayType, isMap, level])
    }
})(TransformOperationExecutor.prototype.transform)

export default class Model {
    static convert<T>(target: ClassType<T>): FirestoreDataConverter<T> {
        return {
            toFirestore: (modelObject: WithFieldValue<T> | PartialWithFieldValue<T>) => {
                return instanceToPlain(modelObject, { exposeUnsetFields: false })
            },
            fromFirestore: (ss) => {
                const payload = ss.data()
                const id = ss.id
                return plainToInstance(target, { id, ...payload }) as T
            },
        }
    }
    static transform = <T>(target: ClassType<T>): FirebaseFirestore.FirestoreDataConverter<T> => ({
        toFirestore: (modelObject) => {
            return instanceToPlain(modelObject)
        },
        fromFirestore: (ss) => {
            const data = ss.data()
            const id = ss.id
            return plainToInstance(target, { id, ...data })
        },
    })
}
