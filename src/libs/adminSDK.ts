import 'reflect-metadata'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
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
        db: getFirestore(),
        auth: getAuth(),
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
        return getFirestore()
    }

    get auth() {
        return getAuth()
    }
}
