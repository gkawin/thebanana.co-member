const { region } = require('firebase-functions')
const { default: next } = require('next')
const { https } = region('asia-southeast1')

const nextjsServer = next({
    dev: false,
    conf: {
        distDir: '.next',
    },
})
const nextjsHandle = nextjsServer.getRequestHandler()

exports.nextjsFunc = https.onRequest(async (req, res) => {
    await nextjsServer.prepare()
    return await nextjsHandle(req, res)
})
