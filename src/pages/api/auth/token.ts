import runsWithMethods from '@/middleware/runsWithMethods'
import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { ok } from 'assert'
import { AdminSDK } from '@/libs/adminSDK'
import { injectable } from 'tsyringe'
import resolver from '@/services/resolver'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import { SocialConnectModel } from '@/models/social-connect/SocialConnect.model'
import Model from '@/models/Model'

@injectable()
class TokenApi {
    #userConnectCol: FirebaseFirestore.CollectionReference<SocialConnectModel>
    constructor(private admin: AdminSDK) {
        this.#userConnectCol = this.admin.db.collection('user_connect').withConverter(Model.convert(SocialConnectModel))
    }

    main: NextApiHandler = async (req, res) => {
        await runWithAuthorization(req, res, {})
        await runsWithMethods(req, res, { methods: ['POST'] })

        try {
            const { connectId } = req.body
            ok(connectId !== null, badRequest())

            const connectInfo = await this.#userConnectCol.doc(connectId).get()
            let payload = {
                authenticationCode: null as string,
                alreadyMember: false,
            }

            if (connectInfo.exists) {
                const authenticationCode = await this.getCustomToken(connectInfo)
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

    private async getCustomToken(connectInfo: FirebaseFirestore.DocumentSnapshot<SocialConnectModel>): Promise<string> {
        const uid = connectInfo.data().user.id
        const authenticationCode = await this.admin.auth.createCustomToken(uid)

        return authenticationCode
    }
}

const handler = resolver.resolve(TokenApi)
export default handler.main
