import 'reflect-metadata'
import { BookingStatus, FailureCode, OmiseHookEvent, PaymentMethod, SourceOfFund } from '@/constants'
import { AdminSDK } from '@/libs/adminSDK'
import { BookingModel } from '@/models/BookingModel'
import Model, { withModel } from '@/models/Model'
import { PaymentEventBodyModel } from '@/models/payment/PaymentEventBody.model'

import { UserAddressModel } from '@/models/UserAddressModel'

import { badRequest, badData } from '@hapi/boom'

import { injectable } from 'tsyringe'

import { CourseModel } from '@/models/course/course.model'
import { UserModelV2 } from '@/models/user/user.model'
import { HandlerApi } from '@/core/BaseHandler'
import { Body, Post } from '@/core/http-decorators'
import { ok } from 'assert'

@injectable()
class HookPaymentBooking extends HandlerApi {
    #bookingRef: FirebaseFirestore.CollectionReference<BookingModel>
    #courseRef: FirebaseFirestore.CollectionReference<CourseModel>
    #userRef: FirebaseFirestore.CollectionReference<UserModelV2>

    constructor(private sdk: AdminSDK) {
        super()
        this.#bookingRef = this.sdk.db.collection('booking').withConverter(Model.convert(BookingModel))
        this.#courseRef = this.sdk.db.collection('courses').withConverter(Model.convert(CourseModel))
        this.#userRef = this.sdk.db.collection('users').withConverter(Model.convert(UserModelV2))
    }

    @Post()
    async main(@Body() body: PaymentEventBodyModel) {
        ok(body?.data, badRequest())
        ok(
            [OmiseHookEvent.CHARGE_CREATE, OmiseHookEvent.CHARGE_COMPLETE].includes(body.key),
            badRequest('invalid event')
        )

        const payload = withModel(PaymentEventBodyModel).fromJson(body)

        const bookingStatus = this.getBookingStatus(payload)

        if (bookingStatus === BookingStatus.REJECTED) {
            console.log('BookingStatus :: REJECTED ', `${payload.data.failureCode} and ${payload.data.failureMessage}`)
            throw badData(payload.data.failureMessage)
        }

        const { bookingCode, courseId, shippingAddressId, userId, startDate, endDate, price, studentInfo } =
            payload.data.metadata

        const course = this.#courseRef.doc(courseId)
        const user = this.#userRef.doc(userId)
        const shippingAddress = user
            .collection('address')
            .withConverter(Model.convert(UserAddressModel))
            .doc(shippingAddressId)

        const response = await this.#bookingRef.doc(bookingCode).set({
            billingId: payload.id,
            bookingCode,
            course,
            user,
            shippingAddress,
            failureCode: FailureCode[payload.data?.failureCode as keyof typeof FailureCode] ?? null,
            createdOn: new Date(),
            sourceOfFund: SourceOfFund.OMISE,
            paymentMethod: body.data.card ? PaymentMethod.CREDIT_CARD : PaymentMethod.PROMPT_PAY,
            price,
            status: this.getBookingStatus(payload),
            receipt: null,
            studentInfo,
            startDate,
            endDate,
            promptPayInfo:
                payload.data.source?.type === 'promptpay'
                    ? {
                          qrCodeImage: payload.data?.source?.scannableCode?.image?.download_uri ?? '',
                          expiryDate: !!payload.data?.expiresAt ? new Date(payload.data?.expiresAt) : null,
                      }
                    : null,
        })

        console.log('PaymentEventBodyModel :: ', response)

        return { status: 'succeed', response }
    }

    private getBookingStatus(payload: PaymentEventBodyModel): BookingStatus {
        if (payload.data.status === 'pending') return BookingStatus.PENDING
        if (payload.data.failureCode) return BookingStatus.REJECTED
        if (payload.data.status === 'successful') return BookingStatus.PAID
        return BookingStatus.CREATED
    }
}

export default HandlerApi.handle(HookPaymentBooking)
