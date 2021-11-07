import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import { badRequest, Boom } from '@hapi/boom'

import { ok } from 'assert'
import { admin } from '@/services'

const enrollHandler: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['POST'] })

    try {
        const { body } = req
        ok(body, badRequest())
        const enrollments = await admin.db.collection('enrollments').add(body)
        return res.status(200).json(enrollments.id)
    } catch (error) {
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            res.status(500)
        }
    }
}

export default enrollHandler
