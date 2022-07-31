import axios, { AxiosInstance } from 'axios'
import type { Charges } from 'omise'
import { singleton } from 'tsyringe'

@singleton()
export class OmiseService {
    #api: AxiosInstance = null

    protected omiseVersion: '2019-05-29'

    private static instance: OmiseService = null

    private static init() {
        if (OmiseService.instance === null) {
            OmiseService.instance = new OmiseService()
        }
        return OmiseService.instance
    }

    constructor() {
        this.#api = axios.create({
            baseURL: 'https://api.omise.co',
            headers: {
                'User-Agent': `omise-nodejs/${process.env.npm_package_version ?? '0.0.1'}`,
                'Omise-Version': this.omiseVersion,
            },
            auth: {
                username: process.env.OMISE_SECRET_KEY,
                password: '',
            },
        })
    }

    get charges() {
        const instance = OmiseService.init()
        return {
            create: (req: Charges.IRequest) =>
                instance.#api.post('/charges', req, { headers: { Authorization: 'Basic' } }),
        }
    }

    // get customers() {
    //     const instance = OmiseService.init()
    //     return instance.customers
    // }
}
