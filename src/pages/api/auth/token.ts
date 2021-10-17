import runsWithMethods from '@/middleware/runsWithMethods'
import { admin } from '@/services'
import { badRequest, Boom, forbidden } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { ok } from 'assert'
import Model from '@/entities/Model'
import { UserConnectEntity } from '@/entities/user-connect.entity'

const handleToken: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['POST'] })

    try {
        const { connectId } = req.body
        ok(connectId !== null, badRequest())

        const connectInfo = await admin.db
            .collection('user_connect')
            .withConverter(Model.transform(UserConnectEntity))
            .doc(connectId)
            .get()

        ok(connectInfo.exists, forbidden())

        const { user: uid } = connectInfo.data()
        const authenticationCode = await admin.auth.createCustomToken(uid, { scope: ['manage', 'read', 'write'] })

        res.status(200).json({ authenticationCode })
    } catch (error) {
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            console.log(error)
            res.status(500).json({})
        }
    }
}

export default handleToken
