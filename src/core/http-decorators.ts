export const __METHOD_METADATA__ = '__METHOD_METADATA__'
export const __ARGS_METADATA__ = '__ARGS_METADATA__'
export const __CUSTOM_ARGS_METADATA__ = '__CUSTOM_ARGS_METADATA__'

export enum RequestMethod {
    POST = 'POST',
    GET = 'GET',
}

export enum RequestParamType {
    body,
    query,
    request,
    __custom__,
}

export const Post = (): MethodDecorator => (target, key, descriptor) => {
    Reflect.defineMetadata(__METHOD_METADATA__, RequestMethod.POST, descriptor.value)
    return descriptor
}

export const Get = (): MethodDecorator => (target, key, descriptor) => {
    Reflect.defineMetadata(__METHOD_METADATA__, RequestMethod.GET, descriptor.value)
    return descriptor
}

const assignParams = (args: Record<number, any>, type: RequestParamType, index: number) => {
    return {
        ...args,
        [`${type}:${index}`]: {
            index,
            type,
        },
    }
}

export const Body = (): ParameterDecorator => (target, methodName, index) => {
    const args = Reflect.getMetadata(__ARGS_METADATA__, target.constructor, methodName) || {}

    Reflect.defineMetadata(
        __ARGS_METADATA__,
        assignParams(args, RequestParamType.body, index),
        target.constructor,
        methodName
    )
}

export const Query = (): ParameterDecorator => (target, methodName, index) => {
    const args = Reflect.getMetadata(__ARGS_METADATA__, target.constructor, methodName) || {}
    Reflect.defineMetadata(
        __ARGS_METADATA__,
        assignParams(args, RequestParamType.query, index),
        target.constructor,
        methodName
    )
}

export const Req = (): ParameterDecorator => (target, methodName, index) => {
    const args = Reflect.getMetadata(__ARGS_METADATA__, target.constructor, methodName) || {}
    Reflect.defineMetadata(
        __ARGS_METADATA__,
        assignParams(args, RequestParamType.request, index),
        target.constructor,
        methodName
    )
}

// export const createParamDecorator =
//     (cb: (context: object) => any) =>
//     (...args: any[]): ParameterDecorator =>
//     (target, methodName, index) => {
//         const args = Reflect.getMetadata(__CUSTOM_ARGS_METADATA__, target.constructor, methodName) || {}
//         Reflect.defineMetadata(
//             __CUSTOM_ARGS_METADATA__,
//             assignParams(args, RequestParamType.__custom__, index),
//             target.constructor,
//             methodName
//         )
//     }
