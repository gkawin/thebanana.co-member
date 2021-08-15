// /* eslint-disable camelcase */
// import 'reflect-metadata'

// import { forbidden, unauthorized } from '@hapi/boom'
// import { ok } from 'assert'

// import adminSDK from '@/components/firebase/adminSDK'

// import runsWith, { extractAccessToken, RunsMiddleware } from './runsWith'

// const admin = adminSDK()
// const authorization: RunsMiddleware = async (req, res, next, options) => {
//     try {
//         ok(req.headers?.authorization, unauthorized('Invalid Token'))

//         const jwtToken = extractAccessToken(req)

//         const valid = await admin.auth().verifyIdToken(jwtToken)

//         console.log(valid)

//         next()
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// }

// export default runsWith(authorization)
