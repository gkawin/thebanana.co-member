import * as firestore from 'firebase-admin/firestore'
import * as auth from 'firebase-admin/auth'
import { initializeApp, cert } from 'firebase-admin/app'

let app: { db: firestore.Firestore; auth: auth.Auth } | null

const adminSDK = () => {
    if (typeof window !== 'undefined') {
        throw Error('for server-side only')
    }

    const serviceAccount = Buffer.from(process.env.GCP_SERVICE_ACCOUNT, 'base64').toString()

    if (!app) {
        initializeApp({ credential: cert(JSON.parse(serviceAccount)) })

        app = {
            db: firestore.getFirestore(),
            auth: auth.getAuth(),
        }
        return app
    }
    return app
}

export default Object.freeze(adminSDK)
