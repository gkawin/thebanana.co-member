import { injectable } from 'tsyringe'
import { AxiosHelperService } from './axios/AxiosHelperService'

@injectable()
export class UserService {
    constructor(private axios: AxiosHelperService) {}

    async getLoginToken(socialId: string) {
        try {
            const { data } = await this.axios.backend.get('/api/auth/login', { params: { socialId } })
            return data.token
        } catch (error) {
            return null
        }
    }
}
