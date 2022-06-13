import 'reflect-metadata'
import runsWithMethods from '@/middleware/runsWithMethods'
import { OmiseService } from '@/services/omise.service'
import resolver from '@/services/resolver'
import { badRequest, Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'
import { validate } from 'class-validator'
import { deserialize } from 'typescript-json-serializer'
import { AdminSDK } from '@/libs/adminSDK'
import Model, { withModel } from '@/models/Model'
import { PaymentChargeBodyModel } from '@/models/payment/PaymentChargeBody.model'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import dayjs from 'dayjs'
import { PaymentMetadataModel } from '@/models/payment/PaymentMetadata.model'
import { PaymentOmiseDataModel } from '@/models/payment/PaymentOmiseData.model'
import { FailureCode, FailureMessage, PaymentMethod } from '@/constants'
import { ChargeResultModel } from '@/models/payment/ChargeResult.model'
import { BookingModel } from '@/models/BookingModel'
import { CourseModel } from '@/models/course/course.model'

@injectable()
class PaymentChargeApi {
    #course: FirebaseFirestore.CollectionReference<CourseModel>
    constructor(private readonly omise: OmiseService, private readonly sdk: AdminSDK) {
        this.#course = this.sdk.db.collection('courses').withConverter(Model.convert(CourseModel))
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

            const productRef = this.#course.doc(payload.productId).withConverter(Model.convert(CourseModel))
            const product = (await productRef.get()).data()
            const today = dayjs()
            const expiredDate = today.add(7, 'day')
            const bookingCode = BookingModel.generateBookingCode()

            const chargedResult = await this.omise.charges
                .create({
                    amount: product.price * 100,
                    currency: 'thb',
                    card: payload?.token ?? null,
                    source: payload?.source ?? null,
                    description: product.title,
                    customer: payload.token ? null : `${payload.studentName} (${payload.nickname})`,
                    metadata: {
                        bookingCode,
                        productId: payload.productId,
                        productCode: product.code,
                        userId: payload.userId,
                        price: product.price,
                        shippingAddressId: payload.shippingAddressId,
                        effectiveDate: today.toDate(),
                        expiredDate: expiredDate.toDate(),
                        startDate: product.startDate,
                        endDate: product.endDate,
                    } as PaymentMetadataModel,
                })
                .then((result) => deserialize(result, PaymentOmiseDataModel))

            const response = withModel(ChargeResultModel)
            const paymentMethod =
                chargedResult?.source?.type === 'promptpay' ? PaymentMethod.PROMPT_PAY : PaymentMethod.CREDIT_CARD

            const message = chargedResult?.failureCode
                ? (FailureCode[chargedResult.failureCode as any] as unknown as FailureCode)
                : null

            res.status(200).json(
                response.fromJson({
                    card: chargedResult?.card ?? null,
                    qrCode: chargedResult?.source?.scannableCode?.image ?? null,
                    status: chargedResult.status,
                    paymentMethod,
                    failureCode: chargedResult?.failureCode,
                    failureMessage: FailureMessage.get(message),
                    bookingCode,
                })
            )
        } catch (error) {
            if (error instanceof Boom) {
                console.log(error)
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
