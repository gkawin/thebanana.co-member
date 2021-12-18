import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import { badData, badRequest, Boom } from '@hapi/boom'

import adminSDK from '@/libs/adminSDK'

import dayjs from 'dayjs'
import Model from '@/models/Model'
import { BookingModel, BookingStatus } from '@/models/BookingModel'
import { validate } from 'class-validator'
import { EnrollDto } from '@/dtos/enroll.dto'
import { plainToClass } from 'class-transformer'

const sdk = adminSDK()
const db = sdk.firestore()

const productCheckoutHandler: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['POST'] })

    try {
        const body = plainToClass(EnrollDto, req.body)
        const validationErrors = await validate(body)

        if (validationErrors.length > 0) throw badRequest(validationErrors.toString())

        const bookingCol = db.collection('booking').withConverter(Model.transform(BookingModel))

        const createdResult = await bookingCol
            .where('user', '==', body.user)
            .where('product', '==', body.product)
            .where('status', '==', BookingStatus.WAITING_FOR_PAYMENT)
            .get()
            .then(({ empty }) => {
                if (!empty) throw badData('product id is waiting for payment')
            })
            .then(() =>
                bookingCol.add({
                    createdOn: new Date(),
                    product: body.product,
                    status: BookingStatus.WAITING_FOR_PAYMENT,
                    expiredOn: dayjs().add(10, 'day').toDate(),
                    user: body.user,
                    metadata: {
                        nickname: '',
                        schoolName: '',
                        studentName: '',
                    },
                })
            )

        res.status(200).json({ status: 'success', booking_session: createdResult.path })
    } catch (error) {
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            res.status(500)
        }
    }
}

export default productCheckoutHandler
