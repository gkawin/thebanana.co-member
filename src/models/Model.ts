import 'reflect-metadata'

import { deserialize, serialize } from 'typescript-json-serializer'

interface ClassType<T> {
    new (...args: any[]): T
}

export default abstract class Model {
    static transform = <T>(target: ClassType<T>): FirebaseFirestore.FirestoreDataConverter<T> => ({
        toFirestore: (instance: any) => {
            return serialize(instance)
        },
        fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot) => {
            const data = snapshot.data() as Record<string, any>
            return deserialize(data, target)
        },
    })
}
