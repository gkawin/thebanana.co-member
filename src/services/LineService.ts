import { injectable } from 'tsyringe'
import { AxiosHelperService } from './axios/AxiosHelperService'
import { ok } from 'assert'
import { badRequest } from '@hapi/boom'

export type IVerifyTokenResponse = { client_id: string }

@injectable()
export class LineService {
    constructor(private axios: AxiosHelperService) {}

    async verifyToken(access_token: string): Promise<IVerifyTokenResponse> {
        ok(access_token, badRequest('need line token'))
        const { data } = await this.axios.line.get<IVerifyTokenResponse>('/oauth2/v2.1/verify', {
            params: { access_token },
        })
        return data
    }
}
