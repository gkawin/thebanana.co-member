import { lineService } from '@/services'
import { forbidden, unauthorized } from '@hapi/boom'
import { ok } from 'assert'

import runsWith, { extractAccessToken, RunsMiddleware } from './runsWith'

export type IAuthorizationOptions = { role: 'admin' }

const authorization: RunsMiddleware<any, IAuthorizationOptions> = async (req, res, next, options) => {
    try {
        ok(req.headers?.authorization, unauthorized('Invalid Token'))

        const jwtToken = extractAccessToken(req)

        const result = await lineService.verifyToken(jwtToken as string)

        ok(result.client_id === '1653826193', forbidden('check your channel'))

        // const userResult = await lineService.getProfile(jwtToken)

        // if (options?.role === 'admin') {
        //     ok(
        //         ['U0f285a5cd521f6d46a352bf726798098', 'Uebb359fa53019a52ee7d1721589026ee'].includes(userResult.userId),
        //         forbidden('you don\t have to permit to access this area')
        //     )
        // }
        next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default runsWith(authorization)
