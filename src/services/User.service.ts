import { injectable } from 'tsyringe'
import { AxiosHelperService } from './axios/AxiosHelperService'

export type GetLoginTokenResponse = { token: string }
@injectable()
export class UserService {
    constructor(private axios: AxiosHelperService) {}

    async getLoginToken(socialId: string): Promise<GetLoginTokenResponse> {
        const { data } = await this.axios.backend.get<GetLoginTokenResponse>('/api/auth/login', {
            params: { socialId },
        })
        return data
    }
}
