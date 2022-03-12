import runsWithMethods from '@/middleware/runsWithMethods'
import runWithAuthorization from '@/middleware/runWithAuthorization'
import { PaymentEventBodyModel } from '@/models/payment/PaymentEventBody.model'
import { Boom } from '@hapi/boom'
import { NextApiHandler } from 'next'
import { deserialize } from 'typescript-json-serializer'

export const PaymentEventHandler: NextApiHandler = async (req, res) => {
    await runWithAuthorization(req, res, {})
    await runsWithMethods(req, res, { methods: ['POST'] })
    try {
        const body = deserialize(req.body, PaymentEventBodyModel)
        res.status(200).json(body)
    } catch (error) {
        console.log(error)
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            res.status(500).json(error)
        }
    }
}

// class PaymentEventApi {
//     #bookingRef: FirebaseFirestore.CollectionReference<BookingModel>
//     #productRef: FirebaseFirestore.CollectionReference<ProductModel>
//     #userRef: FirebaseFirestore.CollectionReference<UserModel>
//     constructor() {
//         const db = adminSDK().db
//         this.#bookingRef = db.collection('booking').withConverter(Model.convert(BookingModel))
//         this.#productRef = db.collection('products').withConverter(Model.convert(ProductModel))
//         this.#userRef = db.collection('users').withConverter(Model.convert(UserModel))
//     }

//     main: NextApiHandler = async (req, res) => {
//         await runWithAuthorization(req, res, {})
//         await runsWithMethods(req, res, { methods: ['POST'] })

//         try {
//             const body = new PaymentEventBodyModel()
//             // const errors = await validate(body)
//             // console.log(errors)
//             // if (errors.length > 0) {
//             //     throw badRequest(errors.toString())
//             // }

//             // let bookingCode = null
//             // switch (body.key) {
//             //     case OmiseHookEvent.CREATE:
//             //         bookingCode = await this.handleChargeCreated(body)
//             //         break

//             //     case OmiseHookEvent.COMPLETE:
//             //         bookingCode = await this.handleChargeCompleted(body)
//             //         break

//             //     default:
//             //         break
//             // }

//             res.status(200).json({ event: {} })
//         } catch (error) {
//             console.log(error)
//             if (error instanceof Boom) {
//                 res.status(error.output.statusCode).json(error.output.payload)
//             } else {
//                 res.status(500).json(error)
//             }
//         }
//     }

//     private async handleChargeCreated(body: PaymentEventBodyModel): Promise<string | null> {
//         try {
//             const bookingCode = body.data.metadata.bookingCode
//             if (!bookingCode) throw badRequest('required bookingCode')

//             const product = this.#productRef.doc(body.data.metadata.productId)
//             const user = this.#userRef.doc(body.data.metadata.userId)
//             const result = await this.#bookingRef.doc(bookingCode).create({
//                 createdOn: new Date(),
//                 expiredOn: null,
//                 metadata: { ...body.data.metadata },
//                 product,
//                 status: BookingStatus.CREATED,
//                 user,
//                 billingId: body.id,
//                 bookingCode,
//                 sourceOfFund: SourceOfFund.OMISE,
//                 source: body.data.source,
//             })
//             console.log(result)
//             return bookingCode
//         } catch (error) {
//             console.error(error)
//             return null
//         }
//     }

//     private async handleChargeCompleted(body: PaymentEventBodyModel) {
//         try {
//             const bookingCode = body.data.metadata.bookingCode
//             if (!bookingCode) throw badRequest('required bookingCode')

//             const result = await this.#bookingRef.doc(bookingCode).update({
//                 status: BookingStatus.PAID,
//                 updatedAt: new Date().toISOString(),
//             })
//             console.log(result)
//             return bookingCode
//         } catch (error) {
//             console.error(error)
//             return null
//         }
//     }
// }

// const handler = container.resolve(PaymentEventApi)
export default PaymentEventHandler
