import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import runsWithAcceptedParams from '@/middleware/runsWithAcceptedParams'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import UserModel from '@/models/UserModel'

const admin = adminSDK()
const db = admin.firestore().collection('users').withConverter(Model.transform(UserModel))

const loginHandler: NextApiHandler<{ status: string }> = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['GET'] })
    await runsWithAcceptedParams(req, res, [{ name: 'socialId', required: false }])

    res.status(200).json({ status: 'ok' })
}

export default loginHandler
