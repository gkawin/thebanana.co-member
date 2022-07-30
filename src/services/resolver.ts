import 'reflect-metadata'
import { container, instanceCachingFactory } from 'tsyringe'
import { InMemoryCache } from './in-memory-cache'
import { AdminSDK } from '@/libs/adminSDK'

const resolver = container
    .register('InMemoryCache', {
        useValue: instanceCachingFactory<InMemoryCache>((c) => c.resolve(InMemoryCache)),
    })
    .registerSingleton(AdminSDK)

export default resolver
