import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { ok } from 'assert'

import { injectable } from 'tsyringe'
import { UserModelV2 } from '@thebanana-members/core/lib/models'
import { AdminSDK } from '@/libs/adminSDK'
import Model from '@thebanana-members/core/lib/models/Model'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import runsWithMethods from '@/middleware/runsWithMethods'
import resolver from '@/services/resolver'

@injectable()
class TokenApi {
    #user: FirebaseFirestore.CollectionReference<UserModelV2>
    constructor(private sdk: AdminSDK) {
        this.#user = this.sdk.db.collection('users').withConverter(Model.convert(UserModelV2))
    }

    main: NextApiHandler = async (req, res) => {
        await runWithAuthorization(req, res, {})
        await runsWithMethods(req, res, { methods: ['POST'] })

        try {
            const { socialId } = req.body
            ok(socialId !== null, badRequest())

            const user = await this.#user.where('socialId', '==', socialId).limit(1).get()
            let payload = {
                authenticationCode: null as string,
                alreadyMember: false,
            }

            if (!user.empty) {
                const authenticationCode = await this.sdk.auth.createCustomToken(user.docs[0].id)
                payload.alreadyMember = true
                payload.authenticationCode = authenticationCode
            }

            res.status(200).json(payload)
        } catch (error) {
            if (error instanceof Boom) {
                res.status(error.output.statusCode).json(error.output.payload)
            } else {
                res.status(500).json({})
            }
        }
    }
}

const handler = resolver.resolve(TokenApi)
export default handler.main
