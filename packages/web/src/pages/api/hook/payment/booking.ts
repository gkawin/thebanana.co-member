import 'reflect-metadata'

import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { deserialize } from 'typescript-json-serializer'
import {
    BookingModel,
    CourseModel,
    PaymentEventBodyModel,
    PaymentMetadataModel,
    UserAddressModel,
    UserModel,
} from '@thebanana/core/lib/models'
import { AdminSDK } from '@/libs/adminSDK'
import Model from '@thebanana/core/lib/models/Model'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import runsWithMethods from '@/middleware/runsWithMethods'
import { BookingStatus, FailureCode, PaymentMethod, SourceOfFund } from '@/constants'
import resolver from '@/services/resolver'

@injectable()
class HookPaymentBooking {
    #bookingRef: FirebaseFirestore.CollectionReference<BookingModel>
    #courseRef: FirebaseFirestore.CollectionReference<CourseModel>
    #userRef: FirebaseFirestore.CollectionReference<UserModel>

    constructor(private sdk: AdminSDK) {
        this.#bookingRef = this.sdk.db.collection('booking').withConverter(Model.convert(BookingModel))
        this.#courseRef = this.sdk.db.collection('courses').withConverter(Model.convert(CourseModel))
        this.#userRef = this.sdk.db.collection('users').withConverter(Model.convert(UserModel))
    }

    main: NextApiHandler = async (req, res) => {
        await runWithAuthorization(req, res, {})
        await runsWithMethods(req, res, { methods: ['POST'] })

        try {
            const body = deserialize(req.body, PaymentEventBodyModel)
            this.validateRequesting(body)

            const status = body.data.status

            switch (status) {
                case 'successful': {
                    await this.setBookingRow(body, BookingStatus.PAID)
                    break
                }
                case 'pending': {
                    await this.setBookingRow(body, BookingStatus.PENDING)
                    break
                }
                case 'failed': {
                }
            }

            res.status(200).json({ status: 'success' })
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

    private async setBookingRow(
        body: PaymentEventBodyModel,
        status: BookingStatus,
        failureCode: FailureCode = null
    ): Promise<string | null> {
        try {
            const { bookingCode, productId, shippingAddressId, userId, startDate, endDate, price } = body.data.metadata

            const course = this.#courseRef.doc(productId)
            const user = this.#userRef.doc(userId)
            const shippingAddress = user
                .collection('address')
                .withConverter(Model.convert(UserAddressModel))
                .doc(shippingAddressId)

            const result = await this.#bookingRef.doc(bookingCode).set({
                billingId: body.id,
                bookingCode: bookingCode,
                sourceOfFund: SourceOfFund.OMISE,
                shippingAddress,
                paymentMethod: body.data.card ? PaymentMethod.CREDIT_CARD : PaymentMethod.PROMPT_PAY,
                createdOn: new Date(),
                course,
                status,
                user,
                startDate,
                endDate,
                price,
                failureCode,
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
