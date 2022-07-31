import 'reflect-metadata'
import { container, instanceCachingFactory } from 'tsyringe'
import { InMemoryCache } from './in-memory-cache'
import { AdminSDK } from '@/libs/adminSDK'
import { OmiseService } from './omise.service'

const resolver = container
    .registerSingleton(OmiseService)
    .registerSingleton(AdminSDK)
    .register('InMemoryCache', {
        useValue: instanceCachingFactory<InMemoryCache>((c) => c.resolve(InMemoryCache)),
    })

export default resolver
