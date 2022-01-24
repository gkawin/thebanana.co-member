import runsWithMethods from '@/middleware/runsWithMethods'
import resolver from '@/services/resolver'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { deserialize } from 'typescript-json-serializer'
import { validate } from 'class-validator'
import { badRequest, Boom } from '@hapi/boom'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { BookingModel } from '@/models/BookingModel'
import { ProductModel } from '@/models/ProductModel'
import { BookingStatus } from '@/constants'
import { UserModel } from '@/models/UserModel'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import { PaymentEventBodyModel } from '@/models/PaymentEventBody.model'

@injectable()
class PaymentEventApi {
    #db: FirebaseFirestore.Firestore = null
    constructor() {
        this.#db = adminSDK().db
    }

    main: NextApiHandler = async (req, res) => {
        await runWithAuthorization(req, res, {})
        await runsWithMethods(req, res, { methods: ['POST'] })

        try {
            const body = deserialize(req.body, PaymentEventBodyModel)
            const errors = await validate(body)
            if (errors.length > 0) {
                throw badRequest(errors.toString())
            }

            const bookingRef = this.#db.collection('booking').withConverter(Model.convert(BookingModel))
            const productRef = this.#db
                .collection('products')
                .doc(body.data.metadata.productId)
                .withConverter(Model.convert(ProductModel))
            const userRef = this.#db
                .collection('users')
                .doc(body.data.metadata.userId)
                .withConverter(Model.convert(UserModel))

            if (body.key === 'charge.create') {
                const bookingCode = BookingModel.generateBookingCode()
                await bookingRef.doc(bookingCode).create({
                    createdOn: new Date(),
                    expiredOn: null,
                    metadata: { ...body.data.metadata },
                    product: productRef,
                    status: BookingStatus.PAID,
                    user: userRef,
                })
                res.status(200).json({ status: 'success', bookingCode })
            } else {
                res.status(200).json({ status: 'fail' })
            }
        } catch (error) {
            console.log(error)
            if (error instanceof Boom) {
                res.status(error.output.statusCode).json(error.output.payload)
            } else {
                res.status(500).json(error)
            }
        }
    }
}

const handler = resolver.resolve(PaymentEventApi)
export default handler.main
