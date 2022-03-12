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
import dayjs from 'dayjs'
import { PaymentMetadataModel } from '@/models/payment/PaymentMetadata.model'

@injectable()
class PaymentChargeApi {
    #productRef: FirebaseFirestore.CollectionReference<ProductModel>
    constructor(private omise: OmiseService) {
        const db = adminSDK().db
        this.#productRef = db.collection('products').withConverter(Model.convert(ProductModel))
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

            const productRef = this.#productRef.doc(payload.productId).withConverter(Model.convert(ProductModel))
            const product = (await productRef.get()).data()
            const bookingCode = BookingModel.generateBookingCode()
            const today = dayjs()

            const chargedResult = await this.omise.charges.create({
                amount: product.price * 100,
                currency: 'thb',
                card: payload.token ?? null,
                source: payload.source,
                description: product.name,
                customer: `${payload.studentName} (${payload.nickname})`,
                metadata: {
                    bookingCode,
                    productId: payload.productId,
                    userId: payload.userId,
                    shippingAddressId: payload.shippingAddressId,
                    effectiveDate: today.toDate(),
                    expiredDate: today.add(7, 'day').toDate(),
                } as PaymentMetadataModel,
            })
            console.log(chargedResult)
            res.status(200).json({ status: 'success', bookingCode })
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
