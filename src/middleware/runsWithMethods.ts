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

export const METHOD_METADATA = 'Methods'
export const GUARD_METADATA = 'Guards'
export const runsWithHandler = 'ApiHandler'

export const RunsWith = (): ClassDecorator => (target) => {
    const prototype = target
    Reflect.defineMetadata(runsWithHandler, prototype, prototype)
}

export const RunWithMethods =
    (methods: ['POST' | 'GET']): MethodDecorator =>
    (target, key, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(METHOD_METADATA, methods, descriptor.value)
    }

export interface CanActivate {
    canActivate(context: any): boolean | Promise<boolean>
}

export const isFunction = (val: any): boolean => typeof val === 'function'

export function extendArrayMetadata<T extends Array<unknown>>(key: string, metadata: T, target: Function) {
    const previousValue = Reflect.getMetadata(key, target) || []
    const value = [...previousValue, ...metadata]
    Reflect.defineMetadata(key, value, target)
}

export const RunWithGuard =
    (...guards: (CanActivate | Function)[]): MethodDecorator & ClassDecorator =>
    (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        const isGuardValid = <T extends Function | Record<string, any>>(guard: T) =>
            guard && (isFunction(guard) || isFunction((guard as Record<string, any>).canActivate))

        if (descriptor) {
            // check Validation can operate.
            const hasError = guards.some((guard) => !isGuardValid(guard))
            if (hasError) {
                throw internal('Some class cannot validate')
            }
            extendArrayMetadata(GUARD_METADATA, guards, descriptor.value)
            return descriptor
        }

        // check Validation can operate.
        const hasError = guards.some((guard) => !isGuardValid(guard))
        if (hasError) {
            throw internal('Some class cannot validate')
        }
        extendArrayMetadata(GUARD_METADATA, guards, target)
        return target
    }
