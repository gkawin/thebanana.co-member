import 'reflect-metadata'

import { NextApiHandler } from 'next'
import { badRequest, Boom, notFound } from '@hapi/boom'

import { ok } from 'assert'
import { injectable } from 'tsyringe'
import { UserModelV2 } from '@thebanana/core/lib/models'
import { AdminSDK } from '@/libs/adminSDK'
import Model from '@thebanana/core/lib/models/Model'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import runsWithMethods from '@/middleware/runsWithMethods'
import resolver from '@/services/resolver'

@injectable()
class UserCreatedApi {
    #userRef: FirebaseFirestore.CollectionReference<UserModelV2>
    constructor(private sdk: AdminSDK) {
        this.#userRef = this.sdk.db.collection('users').withConverter(Model.convert(UserModelV2))
    }

    main: NextApiHandler = async (req, res) => {
        await runWithAuthorization(req, res, {})
        await runsWithMethods(req, res, { methods: ['POST'] })

        try {
            ok(req.query?.userId, notFound('user not found'))
            ok(req.body, badRequest())

            const { userId } = req.query
            const body = req.body

            const writeResult = await this.#userRef.doc(userId.toString()).set(body)

            res.status(200).json(writeResult)
        } catch (error) {
            if (error instanceof Boom) {
                res.status(error.output.statusCode).json(error.output.payload)
            } else {
                res.status(500).json(error)
            }
            console.error(error)
        }
    }
}

const handler = resolver.resolve(UserCreatedApi)
export default handler.main
