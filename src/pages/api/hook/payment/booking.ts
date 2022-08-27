import 'reflect-metadata'
import { BookingStatus, FailureCode, PaymentMethod, SourceOfFund } from '@/constants'
import { AdminSDK } from '@/libs/adminSDK'
import runsWithMethods from '@/middleware/runsWithMethods'
import { BookingModel } from '@/models/BookingModel'
import Model from '@/models/Model'
import { PaymentEventBodyModel } from '@/models/payment/PaymentEventBody.model'
import { PaymentMetadataModel } from '@/models/payment/PaymentMetadata.model'

import { UserAddressModel } from '@/models/UserAddressModel'
import resolver from '@/services/resolver'
import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { deserialize } from 'typescript-json-serializer'
import { CourseModel } from '@/models/course/course.model'
import { UserModelV2 } from '@/models/user/user.model'

@injectable()
class HookPaymentBooking {
    #bookingRef: FirebaseFirestore.CollectionReference<BookingModel>
    #courseRef: FirebaseFirestore.CollectionReference<CourseModel>
    #userRef: FirebaseFirestore.CollectionReference<UserModelV2>

    constructor(private sdk: AdminSDK) {
        this.#bookingRef = this.sdk.db.collection('booking').withConverter(Model.convert(BookingModel))
        this.#courseRef = this.sdk.db.collection('courses').withConverter(Model.convert(CourseModel))
        this.#userRef = this.sdk.db.collection('users').withConverter(Model.convert(UserModelV2))
    }

    main: NextApiHandler = async (req, res) => {
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
                    await this.setBookingRow(body, BookingStatus.REJECTED, body.data.failureCode as any)
                    break
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
            courseId = null,
            userId = null,
            shippingAddressId = null,
        } = body.data.metadata as PaymentMetadataModel
        if (!bookingCode) throw badRequest('required bookingCode')
        if (!courseId) throw badRequest('required productId')
        if (!userId) throw badRequest('required userId')
        if (!shippingAddressId) throw badRequest('required shippingAddressId')
    }

    private async setBookingRow(
        body: PaymentEventBodyModel,
        status: BookingStatus,
        failureCode: FailureCode = null
    ): Promise<string | null> {
        try {
            const { bookingCode, courseId, shippingAddressId, userId, startDate, endDate, price, studentInfo } =
                body.data.metadata

            const course = this.#courseRef.doc(courseId)
            const user = this.#userRef.doc(userId)
            const shippingAddress = user
                .collection('address')
                .withConverter(Model.convert(UserAddressModel))
                .doc(shippingAddressId)

            const result = await this.#bookingRef.doc(bookingCode).create({
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
                receipt: null,
                studentInfo,
                promptPayInfo:
                    body.data.source.type === 'promptpay'
                        ? {
                              qrCodeImage: body.data?.source?.scannableCode?.image?.download_uri ?? '',
                              expiryDate: !!body.data?.expiresAt ? new Date(body.data?.expiresAt) : null,
                          }
                        : null,
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
