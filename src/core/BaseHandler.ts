import runsWithMethods from '@/middleware/runsWithMethods'
import Model, { withModel } from '@/models/Model'
import resolver from '@/services/resolver'
import { Boom } from '@hapi/boom'
import { NextApiRequest, NextApiResponse } from 'next'
import { JsonProperty, Serializable } from 'typescript-json-serializer'
import { RequestParamType, __ARGS_METADATA__, __METHOD_METADATA__ } from './http-decorators'

enum HttpCode {
    OK = 200,
    CREATED = 201,
}

@Serializable()
export class HttpResponseModel<
    TResult extends Record<string, any> | Record<string, any>[],
    TError extends Error | Boom
> {
    @JsonProperty()
    statusCode: number

    @JsonProperty()
    error?: TError

    @JsonProperty()
    message?: string

    @JsonProperty({ isDictionary: true })
    data?: TResult
}

export class HandlerApi {
    private static instance: HandlerApi

    res: NextApiResponse

    static handle(token: new (...args: any[]) => any) {
        if (!HandlerApi.instance) {
            HandlerApi.instance = new HandlerApi()
        }

        return async function (req: NextApiRequest, res: NextApiResponse) {
            const prototype = token.prototype
            const instance = resolver.resolve(token)
            try {
                for (const name of Reflect.ownKeys(prototype)) {
                    const descriptor = Reflect.getOwnPropertyDescriptor(prototype, name)
                    if (name === 'constructor') continue

                    const methodMetadata = Reflect.getMetadata(__METHOD_METADATA__, prototype[name])

                    await runsWithMethods(req, res, { methods: [methodMetadata] })

                    const args = Reflect.getMetadata(__ARGS_METADATA__, token, name) as Record<
                        string,
                        { index: number; type: RequestParamType }
                    >

                    const originalValue = descriptor.value

                    const newArgs = Object.values(args).reduce((acc, { index, type }) => {
                        if (type === RequestParamType.request) {
                            acc[index] = req
                            return acc
                        }

                        const paramType = RequestParamType[type] as keyof NextApiRequest

                        if (!(paramType in req)) return acc

                        acc[index] = req[paramType]
                        return acc
                    }, [])

                    const result = await originalValue.apply(instance, newArgs)

                    res.status(HttpCode.CREATED).json(
                        withModel(HttpResponseModel).fromJson({
                            data: result,
                            statusCode: HttpCode.CREATED,
                        })
                    )
                }
            } catch (error) {
                if (error instanceof Boom) {
                    res.status(error.output.statusCode).json({ ...error.output.payload })
                }
            }
        }
    }
}
