import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import runsWithAcceptedParams from '@/middleware/runsWithAcceptedParams'
import { container } from 'tsyringe'
import { Boom, notFound } from '@hapi/boom'
import { LoginService } from '@/services/handlers/Login.service'
import { ok } from 'assert'
import runsWithAuthorization from '@/middleware/runsWithAuthorization'

const loginSrv = container.resolve(LoginService)

const loginHandler: NextApiHandler = async (req, res) => {
    await runsWithAuthorization(req, res, { role: 'all' })
    await runsWithMethods(req, res, { methods: ['GET'] })
    await runsWithAcceptedParams(req, res, [{ name: 'socialId', required: true }])

    try {
        const { socialId } = req.query
        const socialInfo = await loginSrv.getSocialInfo(socialId.toString())

        ok(socialInfo, notFound('User not found'))

        const token = await loginSrv.generateLoginToken(socialId.toString())
        res.status(200).json({ token })
    } catch (error) {
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            res.status(500).json({ message: error.message })
        }
    }
}

export default loginHandler
