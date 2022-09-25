import { AdminSDK } from '@/libs/adminSDK'
import { extractAccessToken } from '@/middleware/runsWith'
import { NextApiRequest } from 'next'
import { injectable } from 'tsyringe'
import { CanActivated } from '../http-decorators'

@injectable()
export class BearerGuard implements CanActivated {
    constructor(private sdk: AdminSDK) {}

    async canActivate(req: NextApiRequest) {
        try {
            const jwtToken = extractAccessToken(req)
            const tokenPayload = await this.sdk.auth.verifyIdToken(jwtToken)
            console.log('User ::', tokenPayload)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}
