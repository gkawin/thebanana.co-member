import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import { badRequest } from '@hapi/boom'

import { ok } from 'assert'
import { admin } from '@/services'

const loginHandler: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['POST'] })

    const { connectId } = req.body
    ok(connectId !== null, badRequest())

    const getUser = await admin.db.collection('user_connect').doc(connectId).get()
    res.status(200).json({ isMember: getUser.exists })
}

export default loginHandler