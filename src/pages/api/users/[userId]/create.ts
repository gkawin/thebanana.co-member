import 'reflect-metadata'
import { AdminSDK } from '@/libs/adminSDK'
import { injectable } from 'tsyringe'
import { NextApiRequest, NextApiResponse } from 'next'
import { badRequest, Boom, notFound } from '@hapi/boom'
import resolver from '@/services/resolver'
import { UserModelV2 } from '@/models/user/user.model'
import Model from '@/models/Model'

import runsWithMethods, {
    CanActivate,
    GUARD_METADATA,
    METHOD_METADATA,
    RunsWith,
    RunWithGuard,
    RunWithMethods,
} from '@/middleware/runsWithMethods'

export abstract class HandlerApi {
    req: NextApiRequest
    res: NextApiResponse

    static handle(token: new (...args: any[]) => any) {
        const instance = resolver.resolve(token)

        return async function (req: NextApiRequest, res: NextApiResponse) {
            instance.req = req
            instance.res = res
            const methods = Reflect.getMetadata(METHOD_METADATA, instance['main']) ?? []

            try {
                await runsWithMethods(req, res, { methods })
                const result = await instance.main()
                res.status(200).json(result)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    }

    get request(): NextApiRequest {
        return this.req
    }

    abstract main(options?: { statusCode: number }): Promise<Record<any, any>>
}

@injectable()
class Foo implements CanActivate {
    canActivate(context: any): boolean | Promise<boolean> {
        console.log('======== canActivate ========')
        return false
    }
}

@injectable()
@RunsWith()
@RunWithGuard(Foo)
class UserCreatedApi extends HandlerApi {
    #userRef: FirebaseFirestore.CollectionReference<UserModelV2>
    constructor(private sdk: AdminSDK) {
        super()
        this.#userRef = this.sdk.db.collection('users').withConverter(Model.convert(UserModelV2))
    }

    @RunWithMethods(['POST'])
    async main() {
        const req = this.req
        const res = this.res

        return { fooo: 'bar' }

        // await runsWithMethods(req, res, { methods: ['POST'] })

        // try {
        //     ok(req.query?.userId, notFound('user not found'))
        //     ok(req.body, badRequest())

        //     const { userId } = req.query
        //     const body = req.body

        //     const writeResult = await this.#userRef.doc(userId.toString()).set(body)

        //     res.status(200).json(writeResult)
        // } catch (error) {
        //     if (error instanceof Boom) {
        //         res.status(error.output.statusCode).json(error.output.payload)
        //     } else {
        //         res.status(500).json(error)
        //     }
        //     console.error(error)
        // }
    }
}

export default HandlerApi.handle(UserCreatedApi)
