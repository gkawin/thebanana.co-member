import { boomify } from '@hapi/boom'
import axios, { AxiosInstance } from 'axios'
import { injectable } from 'tsyringe'

@injectable()
export class AxiosHelperService {
    #line!: AxiosInstance
    #backend!: AxiosInstance
    constructor() {
        this.setUpLine()
        this.setUpBackend()
    }

    private setUpLine() {
        if (!this.#line) {
            this.#line = axios.create({
                baseURL: 'https://api.line.me',
                timeout: 10000,
            })
            this.#line.interceptors.response.use(
                (r) => r,
                (e) => {
                    if (e.response.data) {
                        const statusCode = e.response.status || 400
                        const data = e.response?.data || { error: null, error_description: null }

                        throw boomify(new Error(), { statusCode, message: data?.error_description })
                    }
                }
            )
        }
    }

    private setUpBackend() {
        if (!this.#backend) {
            this.#backend = axios.create({
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            this.#line.interceptors.response.use(
                (r) => r,
                (e) => {
                    if (e.response.data) {
                        const statusCode = e.response.status || 400
                        const data = e.response?.data || { error: null, error_description: null }

                        throw boomify(new Error(), { statusCode, message: data?.error_description })
                    }
                }
            )
        }
    }

    get line() {
        return this.#line
    }

    get backend() {
        return this.#backend
    }
}
