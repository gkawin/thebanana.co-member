import { container, instanceCachingFactory } from 'tsyringe'
import { OmiseService } from './omise.service'
import { InMemoryCache } from './in-memory-cache'
import { AdminSDK } from '@/libs/adminSDK'

const resolver = container
    .registerSingleton(OmiseService)
    .register('InMemoryCache', {
        useValue: instanceCachingFactory<InMemoryCache>((c) => c.resolve(InMemoryCache)),
    })
    .registerSingleton(AdminSDK)

export default resolver
