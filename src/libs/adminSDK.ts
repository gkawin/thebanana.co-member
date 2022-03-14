import * as firestore from 'firebase-admin/firestore'
import * as auth from 'firebase-admin/auth'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { singleton } from 'tsyringe'

const adminSDK = () => {
    if (typeof window !== 'undefined') {
        throw Error('for server-side only')
    }

    const serviceAccount = Buffer.from(process.env.GCP_SERVICE_ACCOUNT, 'base64').toString()
    const init = getApps().length != 0

    if (!init) {
        initializeApp({ credential: cert(JSON.parse(serviceAccount)) })
    }

    return {
        db: firestore.getFirestore(),
        auth: auth.getAuth(),
    }
}

export default Object.freeze(adminSDK)

@singleton()
export class AdminSDK {
    constructor() {
        if (typeof window !== 'undefined') {
            throw Error('for server-side only')
        }

        const serviceAccount = Buffer.from(process.env.GCP_SERVICE_ACCOUNT, 'base64').toString()
        const init = getApps().length != 0
        if (!init) {
            initializeApp({ credential: cert(JSON.parse(serviceAccount)) })
        }
    }

    get db() {
        return firestore.getFirestore()
    }

    get auth() {
        return auth.getAuth()
    }
}
