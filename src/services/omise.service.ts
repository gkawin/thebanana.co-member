const omise = require('omise')
import { singleton } from 'tsyringe'

@singleton()
export class OmiseService {
    #instance: any

    constructor() {
        this.#instance = omise({
            publicKey: process.env.OMISE_PUBLIC_KEY,
            secretKey: process.env.OMISE_SECRET_KEY,
        })
    }

    get charges() {
        return this.#instance.charges
    }

    get customers() {
        return this.#instance.customers
    }
}
