import { NextApiHandler } from 'next'
import resolver from '@/services/resolver'
import { injectable } from 'tsyringe'
import runsWithMethods from '@/middleware/runsWithMethods'
import adminSDK from '@/libs/adminSDK'
import type { app, firestore } from 'firebase-admin'
import { mobileThaiNumberToRegulary } from '@/utils/phone-number'

@injectable()
class Report {
    static admin: app.App = null
    constructor() {
        if (Report.admin === null) {
            Report.admin = adminSDK() as app.App
        }
    }

    private get admin() {
        return Report.admin
    }

    main: NextApiHandler = async (req, res) => {
        await runsWithMethods(req, res, { methods: ['GET'] })
        const rs = await this.admin
            .firestore()
            .collection('transactions')
            .where('createdOn', '>=', new Date('2021-11-01'))
            .get()

        let summary = 0
        const items = await Promise.all(
            rs.docs.map(async (doc) => {
                const { totalAmount, createdOn, user } = doc.data()
                summary += Number(totalAmount)

                const userRef = user as firestore.DocumentReference
                const parentRef = userRef.collection('parents') as firestore.CollectionReference
                const userInfo = (await userRef.get()).data()
                const parentInfo = await parentRef.get()

                const courseRef = this.admin
                    .firestore()
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
