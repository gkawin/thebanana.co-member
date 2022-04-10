import { BookingStatus, OmiseHookEvent, PaymentMethod, SourceOfFund } from '@/constants'
import { AdminSDK } from '@/libs/adminSDK'
import runsWithMethods from '@/middleware/runsWithMethods'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import { BookingModel } from '@/models/BookingModel'
import Model from '@/models/Model'
import { PaymentEventBodyModel } from '@/models/payment/PaymentEventBody.model'
import { PaymentMetadataModel } from '@/models/payment/PaymentMetadata.model'
import { ProductModel } from '@/models/ProductModel'
import { UserAddressModel } from '@/models/UserAddressModel'
import { UserModel } from '@/models/UserModel'
import resolver from '@/services/resolver'
import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { deserialize } from 'typescript-json-serializer'

@injectable()
class HookPaymentBooking {
    #bookingRef: FirebaseFirestore.CollectionReference<BookingModel>
    #productRef: FirebaseFirestore.CollectionReference<ProductModel>
    #userRef: FirebaseFirestore.CollectionReference<UserModel>

    constructor(private sdk: AdminSDK) {
        this.#bookingRef = this.sdk.db.collection('booking').withConverter(Model.convert(BookingModel))
        this.#productRef = this.sdk.db.collection('products').withConverter(Model.convert(ProductModel))
        this.#userRef = this.sdk.db.collection('users').withConverter(Model.convert(UserModel))
    }

    main: NextApiHandler = async (req, res) => {
        await runWithAuthorization(req, res, {})
        await runsWithMethods(req, res, { methods: ['POST'] })

        try {
            const body = deserialize(req.body, PaymentEventBodyModel)
            this.validateRequesting(body)

            let bookingCode = null
            switch (body.key) {
                case OmiseHookEvent.CREATE:
                    bookingCode = await this.handleChargeCreated(body)
                    break

                case OmiseHookEvent.COMPLETE:
                    bookingCode = await this.handleChargeCompleted(body)
                    break

                default:
                    break
            }

            res.status(200).json({ event: body, bookingCode })
        } catch (error) {
            console.log(error)
            if (error instanceof Boom) {
                res.status(error.output.statusCode).json(error.output.payload)
            } else {
                res.status(500).json(error)
            }
        }
    }

    private validateRequesting(body: PaymentEventBodyModel) {
        const {
            bookingCode = null,
            productId = null,
            userId = null,
            shippingAddressId = null,
        } = body.data.metadata as PaymentMetadataModel
        if (!bookingCode) throw badRequest('required bookingCode')
        if (!productId) throw badRequest('required productId')
        if (!userId) throw badRequest('required userId')
        if (!shippingAddressId) throw badRequest('required shippingAddressId')
    }

    private async handleChargeCreated(body: PaymentEventBodyModel): Promise<string | null> {
        try {
            const { bookingCode, productId, shippingAddressId, userId, startDate, endDate, price } = body.data.metadata

            const product = this.#productRef.doc(productId)
            const user = this.#userRef.doc(userId)
            const shippingAddress = user
                .collection('address')
                .withConverter(Model.convert(UserAddressModel))
                .doc(shippingAddressId)

            const result = await this.#bookingRef.doc(bookingCode).create({
                billingId: body.id,
                sourceOfFund: SourceOfFund.OMISE,
                shippingAddress,
                paymentMethod: body.data.card ? PaymentMethod.CREDIT_CARD : PaymentMethod.PROMPT_PAY,
                createdOn: new Date(),
                product,
                status: BookingStatus.CREATED,
                user,
                startDate,
                endDate,
                price,
            })
            console.log(result)
            return bookingCode
        } catch (error) {
            console.error(error)
            return null
        }
    }

    private async handleChargeCompleted(body: PaymentEventBodyModel) {
        try {
            const bookingCode = body.data.metadata.bookingCode
            if (!bookingCode) throw badRequest('required bookingCode')

            const result = await this.#bookingRef.doc(bookingCode).update({
                status: BookingStatus.PAID,
                updatedAt: new Date().toISOString(),
            })
            console.log(result)
            return bookingCode
        } catch (error) {
            console.error(error)
            return null
        }
    }
}

const handler = resolver.resolve(HookPaymentBooking)
export default handler.main