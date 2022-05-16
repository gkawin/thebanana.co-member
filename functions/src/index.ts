import * as functions from 'firebase-functions'

const fun = functions.region('asia-southeast1')

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const saveUserInfo = fun.https.onRequest
