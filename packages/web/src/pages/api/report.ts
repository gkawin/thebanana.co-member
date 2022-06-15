import 'reflect-metadata'
import { NextApiHandler } from 'next'

import { injectable } from 'tsyringe'

import type { DocumentReference, CollectionReference, Firestore } from 'firebase-admin/firestore'
import adminSDK from '@/libs/adminSDK'
import runsWithMethods from '@/middleware/runsWithMethods'
import { mobileThaiNumberToRegulary } from '@thebanana/core/lib/utils'
import resolver from '@/services/resolver'

@injectable()
class Report {
    #db: Firestore = null
    constructor() {
        this.#db = adminSDK().db
    }

    main: NextApiHandler = async (req, res) => {
        await runsWithMethods(req, res, { methods: ['GET'] })
        const rs = await this.#db.collection('transactions').where('createdOn', '>=', new Date('2021-11-01')).get()

        let summary = 0
        const items = await Promise.all(
            rs.docs.map(async (doc) => {
                const { totalAmount, createdOn, user } = doc.data()
                summary += Number(totalAmount)

                const userRef = user as DocumentReference
                const parentRef = userRef.collection('parents') as CollectionReference
                const userInfo = (await userRef.get()).data()
                const parentInfo = await parentRef.get()

                const courseRef = this.#db
                    .collection('registration_class')
                    .where('user', '==', user)
                    .where('createdOn', '>=', new Date('2021-11-01'))

                const enrolledCourses = (await courseRef.get()).docs.map((v) => ({
                    className: v.data().className,
                    session: v.data().session,
                }))
                return {
                    createdOn: createdOn.toDate().toISOString(),
                    totalAmount: Number(totalAmount),
                    nickname: userInfo.nickname,
                    fullname: userInfo.fullname,
                    phoneNumber: mobileThaiNumberToRegulary(userInfo.phoneNumber),
                    parentName: parentInfo.docs[0].data().fullname,
                    enrolledCourses,
                }
            })
        )

        res.status(200).json({ summary, items })
    }
}

const handler = resolver.resolve(Report)
export default handler.main
