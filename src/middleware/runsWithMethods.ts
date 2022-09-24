import { internal, methodNotAllowed } from '@hapi/boom'
import { ok } from 'assert'

import runsWith, { RunsMiddleware } from './runsWith'

export type AcceptableMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
export type IRunWithMethodOptions = { methods: AcceptableMethods[] }

const methods: RunsMiddleware<any, IRunWithMethodOptions> = (req, res, next, options) => {
    try {
        ok(options?.methods?.length ?? 0 > 0, internal('Please specify data'))
        ok(options?.methods?.includes(req?.method?.toUpperCase() as any), methodNotAllowed())
        next()
    } catch (error) {
        next(error)
    }
}

export default runsWith(methods)
