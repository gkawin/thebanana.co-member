import runsWithMethods from '@/middleware/runsWithMethods'
import { NextApiHandler } from 'next'
import { badRequest, Boom } from '@hapi/boom'

import adminSDK from '@/libs/adminSDK'
import { DocumentReference } from '@firebase/firestore'
import dayjs from 'dayjs'

const sdk = adminSDK()
const db = sdk.firestore()

const enrollHandler: NextApiHandler = async (req, res) => {
    await runsWithMethods(req, res, { methods: ['GET'] })

    try {
        const ref = await db.collection('transactions').where('createdOn', '>=', new Date('2021-09-01')).get()
        let total = 0
        const createdResults = ref.docs.map(async (doc) => {
            const { user: userPathRef, inputAddress: address, parentName, totalAmount, createdOn } = doc.data()
            const userRef = db.doc(userPathRef.path)
            const userInfo = (await userRef.get()).data()
            const usrSchoolInfo = (await userRef.collection('school').get()).docs[0].data()

            total += Number(totalAmount)

            return {
                studentName: userInfo.fullname,
                studentNickname: userInfo.nickname,
                grade: usrSchoolInfo.grade,
                school: usrSchoolInfo.school,
                address,
                parentName,
                totalAmount: Number(totalAmount),
                generatedInvoiceOn: dayjs(createdOn.toDate()).format('YYYY-MM-DD HH:mm:ss'),
            }
        })
        const results = await Promise.all(createdResults)
        res.status(200).json({ results, total })
    } catch (error) {
        if (error instanceof Boom) {
            res.status(error.output.statusCode).json(error.output.payload)
        } else {
            res.status(500)
        }
    }
}

export default enrollHandler
