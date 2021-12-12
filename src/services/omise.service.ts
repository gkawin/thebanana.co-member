import omise from 'omise'
import { singleton } from 'tsyringe'

@singleton()
export class OmiseService {
    static _instance: OmiseService

    static getInstance() {
        if (!OmiseService._instance) {
            OmiseService._instance = new OmiseService()
            return OmiseService._instance
        }
        return OmiseService._instance
    }

    #instance: omise.IOmise
    constructor() {
        this.#instance = omise({
            publicKey: 'pkey_test_5q52539zzmb9psl4k9p',
            secretKey: 'skey_test_5prhner7awkpj5pjd73',
        })
    }

    get charges() {
        return this.#instance.charges
    }
}
