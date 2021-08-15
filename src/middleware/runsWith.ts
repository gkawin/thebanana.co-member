import { Boom, internal, unauthorized } from '@hapi/boom'
import { ok } from 'assert'
import { NextApiRequest, NextApiResponse } from 'next'

export interface OptionsRole {
    // role?: 'admin' | 'everyone'
    // paramOption?: { accepted: string[]; strict?: boolean }
    // methods?: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS')[]
}

export interface ExtendsApiRequest extends NextApiRequest {}
export interface ExtendsApiResponse<TResponse> extends NextApiResponse<TResponse> {}

export type RunsMiddleware<TResponse = unknown, TOption = any> = (
    req: ExtendsApiRequest,
    res: ExtendsApiResponse<TResponse>,
    nextFunction: any,
    options: TOption
) => void

export const extractAccessToken = (req: NextApiRequest) => {
    const token = req.headers?.authorization
    ok(token, internal('need token'))

    const isBearer = RegExp(/^Bearer\s*/g).test(token)
    ok(isBearer, unauthorized('Invalid Token Type'))
    return token.split('Bearer ').pop()
}

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never

export default function runsWith<T extends RunsMiddleware, O = ArgumentTypes<T>[3]>(middleware: T) {
    return (req: NextApiRequest, res: NextApiResponse, options: O) =>
        new Promise((resolve) => {
            middleware(
                req,
                res,
                (result: unknown) => {
                    if (result instanceof Boom) {
                        return res.status(result.output.statusCode).json(result.output.payload)
                    }
                    if (result instanceof Error) {
                        return res
                            .status(500)
                            .json({ statusCode: 500, error: 'Internal Server Error', message: 'Server Error' })
                    }
                    return resolve(result)
                },
                options
            )
        })
}
