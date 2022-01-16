import { QueryDocumentSnapshot, FirestoreDataConverter as A } from 'firebase-admin/firestore'
import type { QueryDocumentSnapshot as ClientQuerySS, DocumentData, PartialWithFieldValue } from 'firebase/firestore'
import { deserialize, serialize } from 'typescript-json-serializer'

interface ClassType<T> {
    new (...args: any[]): T
}

export default class Model {
    static convert<T>(target: ClassType<T>) {
        return {
            toFirestore: (o: PartialWithFieldValue<T> | Partial<T>) => {
                return serialize(o)
            },
            fromFirestore: (ss: QueryDocumentSnapshot<DocumentData> | ClientQuerySS<DocumentData>) => {
                const payload = ss.data()
                const id = ss.id
                return deserialize({ id, ...payload }, target)
            },
        }
    }
}
