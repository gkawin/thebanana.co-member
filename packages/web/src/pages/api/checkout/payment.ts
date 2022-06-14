import 'reflect-metadata'
import { NextApiHandler } from 'next'
import resolver from 'packages/web/src/services/resolver'
import { injectable } from 'tsyringe'
import runsWithMethods from 'packages/web/src/middleware/runsWithMethods'
import { OmiseService } from 'packages/web/src/services/omise.service'

@injectable()
class PaymentHandler {
    constructor(private omise: OmiseService) {}

    main: NextApiHandler = async (req, res) => {
        await runsWithMethods(req, res, { methods: ['POST'] })
        try {
            const result = await this.omise.charges.create({ customer: 'foo', amount: 10000, currency: 'thb' })

            if (result.paid) {
                console.log('success')
            }

            res.status(200).json('pooo')
        } catch (error) {
            res.status(200).json(error)
        }
    }
}

const handler = resolver.resolve(PaymentHandler)
export default handler.main
