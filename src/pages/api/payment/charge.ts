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
import { PaymentChargeBody } from '@/dtos/PaymentChargeBody.dto'

@injectable()
class PaymentChargeApi {
    #db: FirebaseFirestore.Firestore = null
    constructor(private omise: OmiseService) {
        this.#db = adminSDK().db
    }

    main: NextApiHandler = async (req, res) => {
        await runsWithMethods(req, res, { methods: ['POST'] })
        try {
            if (!req.body) throw badRequest()
            const payload = deserialize(JSON.stringify(req.body), PaymentChargeBody)

            const hasErrors = await validate(payload)
            if (hasErrors.length > 0) {
                throw badRequest(hasErrors.toString())
            }

            const productRef = this.#db
                .collection('products')
                .doc(payload.productId)
                .withConverter(Model.convert(ProductModel))
            const product = (await productRef.get()).data()
            const { token, source, ...props } = payload

            const chargedResult = await this.omise.charges.create({
                amount: product.price * 100,
                currency: 'thb',
                card: token,
                source,
                description: product.name,
                metadata: {
                    ...props,
                    effectiveDate: product.effectiveDate.toISOString(),
                    expiredDate: product.expiredDate.toISOString(),
                },
            })
            res.status(200).json({ chargedResult: chargedResult.id, status: 'success' })
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
