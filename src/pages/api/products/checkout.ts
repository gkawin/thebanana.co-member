import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import { badRequest, Boom } from '@hapi/boom'

import adminSDK from '@/libs/adminSDK'

import dayjs from 'dayjs'
import { BookingModel } from '@/models/BookingModel'
import { validate } from 'class-validator'
import Model from '@/models/Model'
import { ProductModel } from '@/models/ProductModel'
import { UserModel } from '@/models/UserModel'
import { BookingStatus } from '@/constants'

const productCheckoutHandler: NextApiHandler = async (req, res) => {
    const { db } = adminSDK()
    await runsWithMethods(req, res, { methods: ['POST'] })

    try {
        const body = req.body
        const validationErrors = await validate(body)

        if (validationErrors.length > 0) throw badRequest(validationErrors.toString())

        const bookingCol = db.collection('booking').withConverter(Model.convert(BookingModel))
        const productRef = db.collection('products').doc(body.product).withConverter(Model.convert(ProductModel))
        const userRef = db.collection('users').doc(body.user).withConverter(Model.convert(UserModel))
        let bookingCode = BookingModel.generateBookingCode()

        const booking = await bookingCol
            .where('user', '==', userRef)
            .where('product', '==', productRef)
            .where('status', '==', BookingStatus.CHECKOUT)
            .get()

        if (booking.empty) {
            await bookingCol.add({
                bookingCode,
                createdOn: new Date(),
                product: productRef,
                status: BookingStatus.CHECKOUT,
                expiredOn: dayjs().add(10, 'day').toDate(),
                user: userRef,
                metadata: {},
            })
        } else {
            bookingCode = booking.docs[0].data().bookingCode
        }

        res.status(200).json({ status: 'success', bookingCode })
    } catch (error) {
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            res.status(500)
        }
    }
}

export default productCheckoutHandler
