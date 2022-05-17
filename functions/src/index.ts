import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

const fun = functions.region('asia-southeast1')

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const saveUserInfo = fun.auth.user().onCreate(async (user) => {
    try {
        const writeResult = await admin.firestore().collection('users').doc(user.uid).set({
            createdAt: new Date(),
        })
        console.log(writeResult)
    } catch (error) {
        console.error(error)
    }
})
