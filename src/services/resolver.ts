import 'reflect-metadata'
import { container, instanceCachingFactory } from 'tsyringe'
import { OmiseService } from './omise.service'
import { InMemoryCache } from './in-memory-cache'

const resolver = container.registerSingleton(OmiseService).register('InMemoryCache', {
    useValue: instanceCachingFactory<InMemoryCache>((c) => c.resolve(InMemoryCache)),
})

export default resolver
