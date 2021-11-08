import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import { badRequest, Boom } from '@hapi/boom'

import { ok } from 'assert'
import adminSDK from '@/libs/adminSDK'
import { IsString, validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

class EnrollmentRequestDto {
    @IsString()
    productId: string

    @IsString()
    userId: string
}

const enrollHandler: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['POST'] })
    const sdk = adminSDK()
    const db = sdk.firestore()

    try {
        const { body } = req
        const invalid = await validate(plainToClass(EnrollmentRequestDto, body))

        ok(invalid.length === 0, badRequest())

        const enrollments = await db.collection('enrollments').add(body)
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
