import { badRequest, internal } from '@hapi/boom'
import { ok } from 'assert'

import runsWith, { RunsMiddleware } from './runsWith'

// const checkParams = (requestedParams: string[], acceptedParams: string[]) => {
//     const authorizedParams = requestedParams.some((k) => acceptedParams.includes(k))
//     ok(authorizedParams, badRequest('some parameters are not acceptable.'))
// }

export type IAcceptedParamsOptions = { name: string; required?: boolean }[]

const acceptedParams: RunsMiddleware<any, IAcceptedParamsOptions> = (req, res, next, options) => {
    try {
        const params = Object.keys(req.query) || []
        ok(options.length > 0, internal('please specified acceptable parameters.'))
        ok(params.length > 0, badRequest('please specified acceptable parameters.'))

        const matched = params.some((param) => {
            return options.find(({ name }) => name === param)
        })

        ok(matched, badRequest('some params is missing.'))
        // const { accepted, strict } = options['']

        // if (!strict && requestedParams.length === 0) next()
        // if (!strict && requestedParams.length > 0) checkParams(requestedParams, accepted)

        // if (strict) checkParams(requestedParams, accepted)
        next()
    } catch (error) {
        next(error)
    }
}

export default runsWith(acceptedParams)
