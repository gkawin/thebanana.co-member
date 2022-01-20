// import adminSDK from '@/libs/adminSDK'
import runsWithMethods from '@/middleware/runsWithMethods'
import { OmiseService } from '@/services/omise.service'
import resolver from '@/services/resolver'
import { badRequest, Boom } from '@hapi/boom'
import { ok } from 'assert'
import { NextApiHandler } from 'next'
import { injectable } from 'tsyringe'

@injectable()
class Report {
    // #db: FirebaseFirestore.Firestore = null
    constructor(private omise: OmiseService) {
        // this.#db = adminSDK().db
    }

    main: NextApiHandler = async (req, res) => {
        await runsWithMethods(req, res, { methods: ['POST'] })
        try {
            const { token, source, product } = req.body
            ok(token || product, badRequest())
            const chargedResult = await this.omise.charges.create({
                amount: product.price * 100,
                currency: 'thb',
                card: token,
                source,
                description: product.name,
            })
            res.status(200).json({ chargedResult: chargedResult.id, status: 'success' })
        } catch (error) {
            if (error instanceof Boom) {
                res.status(error.output.statusCode).json(error.output.payload)
            } else {
                console.error(error)
                res.status(500).json(error)
            }
        }
    }
}

const handler = resolver.resolve(Report)
export default handler.main
