import { BookingStatus, OmiseHookEvent, PaymentMethod, SourceOfFund } from '@/constants'
import { AdminSDK } from '@/libs/adminSDK'
import runsWithMethods from '@/middleware/runsWithMethods'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import { BookingModel } from '@/models/BookingModel'
import Model from '@/models/Model'
import { PaymentEventBodyModel } from '@/models/payment/PaymentEventBody.model'
import { ProductModel } from '@/models/ProductModel'
import { UserAddressModel } from '@/models/UserAddressModel'
import { UserModel } from '@/models/UserModel'
import resolver from '@/services/resolver'
import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { deserialize } from 'typescript-json-serializer'

@injectable()
class PaymentEventApi {
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

            res.status(200).json({ event: body })
        } catch (error) {
            console.log(error)
            if (error instanceof Boom) {
                res.status(error.output.statusCode).json(error.output.payload)
            } else {
                res.status(500).json(error)
            }
        }
    }

    private async handleChargeCreated(body: PaymentEventBodyModel): Promise<string | null> {
        try {
            const {
                bookingCode = null,
                effectiveDate = null,
                expiredDate = null,
                productId = null,
                userId = null,
                shippingAddressId = null,
            } = body.data.metadata
            if (!bookingCode) throw badRequest('required bookingCode')
            if (!productId) throw badRequest('required productId')
            if (!userId) throw badRequest('required userId')
            if (!shippingAddressId) throw badRequest('required shippingAddressId')

            const product = this.#productRef.doc(productId)
            const user = this.#userRef.doc(userId)
            const shippingAddress = user
                .collection('address')
                .withConverter(Model.convert(UserAddressModel))
                .doc(shippingAddressId)
            const result = await this.#bookingRef.doc(bookingCode).create({
                paymentMethod: body.data.card ? PaymentMethod.CREDIT_CARD : PaymentMethod.PROMPT_PAY,
                createdOn: effectiveDate,
                expiredOn: expiredDate,
                shippingAddress: shippingAddress,
                product,
                status: BookingStatus.CREATED,
                user,
                billingId: body.id,
                bookingCode,
                sourceOfFund: SourceOfFund.OMISE,
                scannableCode: !body.data.source?.scannable_code
                    ? null
                    : ({
                          type: body.data.source?.scannable_code.type,
                          ...body.data.source?.scannable_code.image,
                      } as any),
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
            return bookingCode
        } catch (error) {
            console.error(error)
            return null
        }
    }
}

const handler = resolver.resolve(PaymentEventApi)
export default handler.main
