import admin from 'firebase-admin'

const adminSDK = () => {
    if (typeof window !== 'undefined') {
        throw Error('for server-side only')
    }
    if (admin.apps.length > 0) {
        return admin
    }
    return admin.initializeApp({
        credential: admin.credential.cert({
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            projectId: process.env.FIREBASE_PROJECT_ID,
        }),
        databaseURL: 'https://thebanana-d9286.firebaseio.com',
    })
}

export const getServerTimestamp = () => admin.firestore.FieldValue.serverTimestamp()

export default Object.freeze(adminSDK)
