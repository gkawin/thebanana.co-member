import runsWithMethods from '@/middleware/runsWithMethods'
import resolver from '@/services/resolver'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { deserialize, JsonProperty, Serializable } from 'typescript-json-serializer'
import { validate } from 'class-validator'
import { badRequest, Boom } from '@hapi/boom'
import { CheckoutFormField } from '@/pages/purchase/[slug]'
import adminSDK from '@/libs/adminSDK'
import Model from '@/models/Model'
import { BookingModel } from '@/models/BookingModel'
import { ProductModel } from '@/models/ProductModel'
import { BookingStatus } from '@/constants'
import { UserModel } from '@/models/UserModel'

@Serializable()
class PaymentEventBody {
    @JsonProperty()
    key: string

    @JsonProperty()
    created_at: string

    @JsonProperty()
    id: string

    @JsonProperty()
    data: {
        object: string
        id: string
        amount: number
        net: number
        fee: number
        fee_vat: number
        interest: number
        interest_vat: number
        funding_amount: number
        refunded_amount: number
        transaction_fees: { fee_flat: string; fee_rate: string; vat_rate: string }
    }

    @JsonProperty()
    description: string

    @JsonProperty()
    metadata: CheckoutFormField
}

@injectable()
class PaymentEventApi {
    #db: FirebaseFirestore.Firestore = null
    constructor() {
        this.#db = adminSDK().db
    }

    main: NextApiHandler = async (req, res) => {
        await runsWithMethods(req, res, { methods: ['POST'] })

        try {
            const body = deserialize(req.body, PaymentEventBody)
            const errors = await validate(body)
            if (errors.length > 0) {
                throw badRequest(errors.toString())
            }

            console.log(body)

            const bookingRef = this.#db.collection('booking').withConverter(Model.convert(BookingModel))
            const productRef = this.#db
                .collection('products')
                .doc(body.metadata.productId)
                .withConverter(Model.convert(ProductModel))
            const userRef = this.#db
                .collection('users')
                .doc(body.metadata.userId)
                .withConverter(Model.convert(UserModel))

            const bookingCode = BookingModel.generateBookingCode()
            await bookingRef.doc(bookingCode).create({
                createdOn: new Date(),
                expiredOn: null,
                metadata: { ...body.data, ...body.metadata },
                product: productRef,
                status: BookingStatus.PAID,
                user: userRef,
            })

            res.status(200).json({ status: 'success', bookingCode })
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
