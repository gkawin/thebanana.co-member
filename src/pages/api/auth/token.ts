import runsWithMethods from '@/middleware/runsWithMethods'
import { badRequest, Boom, forbidden } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { ok } from 'assert'
import adminSDK from '@/libs/adminSDK'

const handleToken: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['POST'] })
    const { db, auth } = adminSDK()

    try {
        const { connectId } = req.body
        ok(connectId !== null, badRequest())

        const connectInfo = await db.collection('user_connect').doc(connectId).get()
        ok(connectInfo.exists, forbidden())

        const uid = connectInfo.data().user.id
        const authenticationCode = await auth.createCustomToken(uid)

        res.status(200).json({ authenticationCode })
    } catch (error) {
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            res.status(500).json({})
        }
    }
}

export default handleToken
