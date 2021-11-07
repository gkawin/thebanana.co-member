import { classToPlain, plainToClass } from 'class-transformer'
import { firestore } from 'firebase-admin'

interface ClassType<T> {
    new (...args: any[]): T
}

export default abstract class Model {
    static transform = <T>(target: ClassType<T>): FirebaseFirestore.FirestoreDataConverter<T> => ({
        toFirestore: (modelObject) => {
            return classToPlain(modelObject)
        },
        fromFirestore: (snapshot: FirebaseFirestore.QueryDocumentSnapshot<T>) => {
            const data = snapshot.data()

            const o = Object.entries(data).reduce((acc, [key, value]) => {
                if (value instanceof firestore.Timestamp) {
                    acc = { ...acc, [key]: value.toDate() }
                } else if (value instanceof firestore.DocumentReference) {
                    acc = { ...acc, [key]: value.id }
                } else if (value instanceof firestore.CollectionReference) {
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
