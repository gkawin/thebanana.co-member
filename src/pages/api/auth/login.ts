import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import runsWithAcceptedParams from '@/middleware/runsWithAcceptedParams'

const loginHandler: NextApiHandler<{ status: string }> = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['GET'] })
    await runsWithAcceptedParams(req, res, [{ name: 'socialId', required: false }])

    res.status(200).json({ status: 'ok' })
}

export default loginHandler
