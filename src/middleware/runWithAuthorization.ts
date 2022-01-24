import runsWith, { RunsMiddleware } from './runsWith'

const runWithAuthorization: RunsMiddleware<any, any> = (req, res, next, options) => {
    try {
        // const authorization = req.headers?.authorization ?? ''
        // const token = authorization.split(' ')[1]

        next()
    } catch (error) {
        next(error)
    }
}

export default runsWith(runWithAuthorization)
