import 'reflect-metadata'

import { badRequest } from '@hapi/boom'
import { injectable } from 'tsyringe'
import { validate } from 'class-validator'
import { deserialize } from 'typescript-json-serializer'
import { AdminSDK } from '@/libs/adminSDK'
import Model, { withModel } from '@/models/Model'
import { PaymentChargeBodyModel } from '@/models/payment/PaymentChargeBody.model'
import dayjs from 'dayjs'
import { PaymentOmiseDataModel } from '@/models/payment/PaymentOmiseData.model'
import { FailureCode, FailureMessage, PaymentMethod } from '@/constants'
import { ChargeResultModel } from '@/models/payment/ChargeResult.model'
import { BookingModel } from '@/models/BookingModel'
import { CourseModel } from '@/models/course/course.model'
import { OmiseService } from '@/services/omise.service'
import { HandlerApi } from '@/core/BaseHandler'
import { Body, Post, UseGuard } from '@/core/http-decorators'
import { BearerGuard } from '@/core/guards/bearer.guard'

@injectable()
class PaymentChargeApi extends HandlerApi {
    #course: FirebaseFirestore.CollectionReference<CourseModel>
    constructor(private sdk: AdminSDK, private omise: OmiseService) {
        super()
        this.#course = this.sdk.db.collection('courses').withConverter(Model.convert(CourseModel))
    }

    @Post()
    @UseGuard(BearerGuard)
    async main(@Body() body: PaymentChargeBodyModel) {
        const hasErrors = await validate(body)
        if (hasErrors.length > 0) {
            throw badRequest(hasErrors.toString())
        }

        const productRef = this.#course.doc(body.courseId).withConverter(Model.convert(CourseModel))
        const product = (await productRef.get()).data()
        const today = dayjs()
        const expiredDate = today.add(7, 'day')
        const bookingCode = BookingModel.generateBookingCode()
        const { token: card = null, source = null, studentName, nickname, school, ...props } = body

        const chargedResult = await this.omise.charges
            .create({
                amount: product.price * 100,
                currency: 'thb',
                card,
                source,
                description: product.title,
                customer: body.token ? null : body.userId,
                metadata: {
                    ...props,
                    bookingCode,
                    studentInfo: {
                        studentName,
                        nickname,
                        school,
                    },
                    productCode: product.code,
                    price: product.price,
                    enrollmentAt: today.toDate(),
                    expiredDate: expiredDate.toDate(),
                    startDate: product.startDate,
                    endDate: product.endDate,
                },
            })
            .then((result: any) => deserialize(result, PaymentOmiseDataModel))

        const response = withModel(ChargeResultModel)
        const paymentMethod =
            chargedResult?.source?.type === 'promptpay' ? PaymentMethod.PROMPT_PAY : PaymentMethod.CREDIT_CARD

        const message = chargedResult?.failureCode
            ? (FailureCode[chargedResult.failureCode as any] as unknown as FailureCode)
            : null

        return response.fromJson({
            card: chargedResult?.card ?? null,
            qrCode: chargedResult?.source?.scannableCode?.image ?? null,
            status: chargedResult.status,
            paymentMethod,
            failureCode: chargedResult?.failureCode,
            failureMessage: FailureMessage.get(message),
            bookingCode,
        })
    }
}

export default HandlerApi.handle(PaymentChargeApi)
