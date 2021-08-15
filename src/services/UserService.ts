import { injectable } from 'tsyringe'
import { AxiosHelperService } from './axios/AxiosHelperService'

@injectable()
export class UserService {
    constructor(private axios: AxiosHelperService) {}

    async isRegistered(socialId: string) {
        const { data } = await this.axios.backend.get('/api/auth/login', { params: { socialId } })
        return data
    }
}
