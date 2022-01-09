import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import { badData, badRequest, Boom } from '@hapi/boom'

import adminSDK from '@/libs/adminSDK'

import dayjs from 'dayjs'
import { BookingStatus } from '@/models/BookingModel'
import { validate } from 'class-validator'

const sdk = adminSDK()
const db = sdk.firestore()

const productCheckoutHandler: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['POST'] })

    try {
        const body = req.body
        const validationErrors = await validate(body)

        if (validationErrors.length > 0) throw badRequest(validationErrors.toString())

        const bookingCol = db.collection('booking')
        const productRef = db.collection('products').doc(body.product)
        const userRef = db.collection('users').doc(body.user)

        const createdResult = await bookingCol
            .where('user', '==', userRef)
            .where('product', '==', productRef)
            .where('status', '==', BookingStatus.WAITING_FOR_PAYMENT)
            .get()
            .then(({ empty }) => {
                if (!empty) throw badData('product id is waiting for payment')
            })
            .then(() =>
                bookingCol.add({
                    createdOn: new Date(),
                    product: productRef,
                    status: BookingStatus.WAITING_FOR_PAYMENT,
                    expiredOn: dayjs().add(10, 'day').toDate(),
                    user: userRef,
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
