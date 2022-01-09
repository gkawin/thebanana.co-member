import type { FirestoreDataConverter } from 'firebase/firestore'
import type { firestore } from 'firebase-admin'
import { deserialize, serialize } from 'typescript-json-serializer'

interface ClassType<T = Model> {
    new (...args: any[]): T
}

export default class Model {
    static convert<T>(target: ClassType<T>): firestore.FirestoreDataConverter<T> & FirestoreDataConverter<T> {
        return {
            toFirestore: (o) => {
                return serialize(o) as T
            },
            fromFirestore: (ss) => {
                const payload = ss.data()
                const id = ss.id
                return deserialize({ id, ...payload }, target)
            },
        }
    }
}
