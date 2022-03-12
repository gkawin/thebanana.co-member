import runsWithMethods from '@/middleware/runsWithMethods'
import { ProductModel } from '@/models/ProductModel'
import { OmiseService } from '@/services/omise.service'
import resolver from '@/services/resolver'
import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { validate } from 'class-validator'
import { deserialize } from 'typescript-json-serializer'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { PaymentChargeBodyModel } from '@/models/payment/PaymentChargeBody.model'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import { BookingModel } from '@/models/BookingModel'
import { UserModel } from '@/models/UserModel'

@injectable()
class PaymentChargeApi {
    #db: FirebaseFirestore.Firestore = null
    constructor(private omise: OmiseService) {
        this.#db = adminSDK().db
    }

    main: NextApiHandler = async (req, res) => {
        await runWithAuthorization(req, res, {})
        await runsWithMethods(req, res, { methods: ['POST'] })
        try {
            if (!req.body) throw badRequest()
            const payload = deserialize(JSON.stringify(req.body), PaymentChargeBodyModel)

            const hasErrors = await validate(payload)
            if (hasErrors.length > 0) {
                throw badRequest(hasErrors.toString())
            }

            const { token, source, productId, userId, shippingAddressId, ...metadata } = payload

            const productRef = this.#db.collection('products').doc(productId).withConverter(Model.convert(ProductModel))
            const userRef = this.#db.collection('users').doc(userId).withConverter(Model.convert(UserModel))
            const bookingRef = this.#db.collection('booking').withConverter(Model.convert(BookingModel))
            const addressRef = userRef.collection('address').doc(shippingAddressId)

            const product = (await productRef.get()).data()
            const bookingCode = BookingModel.generateBookingCode()

            try {
                const chargedResult = await this.omise.charges.create({
                    amount: product.price * 100,
                    currency: 'thb',
                    card: token ?? null,
                    source,
                    description: product.name,
                    metadata: {
                        bookingCode,
                        productId: productId,
                        userId: userId,
                        effectiveDate: product.effectiveDate.toISOString(),
                        expiredDate: product.expiredDate.toISOString(),
                    },
                })
                console.log(chargedResult)
                res.status(200).json({ status: 'success', bookingCode })
            } catch (error) {
                console.error(error)
            }
        } catch (error) {
            if (error instanceof Boom) {
                res.status(error.output.statusCode).json(error.output.payload)
            } else {
                console.error(error)
                res.status(500).json(error)
            }
        }
    }
}

const handler = resolver.resolve(PaymentChargeApi)
export default handler.main
