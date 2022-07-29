import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import type { QueryDocumentSnapshot as ClientQuerySS, DocumentData, PartialWithFieldValue } from 'firebase/firestore'
import { serialize, deserialize } from 'typescript-json-serializer'

export interface ClassInstance<T> {
    new (...args: any[]): T
}

type ExcludedToJson<K> = K extends 'toJSON' ? never : K

type ExcludedModel<M> = { [K in ExcludedToJson<keyof M>]?: any }

export default class Model {
    static convert<T>(target: ClassInstance<T>) {
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

export const withModel = <T>(cls: new (...args: unknown[]) => T) => ({
    fromJson(json: ExcludedModel<T>) {
        return deserialize(json, cls)
    },
})
