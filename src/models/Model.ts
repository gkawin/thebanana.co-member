import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import type { QueryDocumentSnapshot as ClientQuerySS, DocumentData, PartialWithFieldValue } from 'firebase/firestore'
import { JsonSerializer } from 'typescript-json-serializer'

export interface ClassInstance<T> {
    new (...args: any[]): T
}

type ExcludedToJson<K> = K extends 'toJSON' ? never : K

type ExcludedModel<M> = { [K in ExcludedToJson<keyof M>]?: any }

const j = new JsonSerializer()

export default class Model {
    static convert<T>(target: ClassInstance<T>) {
        return {
            toFirestore: (o: PartialWithFieldValue<T> | Partial<T>) => {
                return j.serialize(o as any)
            },
            fromFirestore: (ss: QueryDocumentSnapshot<DocumentData> | ClientQuerySS<DocumentData>) => {
                const payload = ss.data()
                const id = ss.id
                return j.deserialize({ id, ...payload }, target)
            },
        }
    }
}

export const withModel = <T>(cls: new (...args: unknown[]) => T) => ({
    fromJson(json: ExcludedModel<T>) {
        return j.deserialize(json, cls)
    },
})
