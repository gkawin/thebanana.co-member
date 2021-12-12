export class InMemoryCache {
    #cache: Map<string, any>
    constructor() {
        this.#cache = new Map<string, any>()
    }

    set(key: string, value: any) {
        this.#cache.set(key, value)
    }

    get(key: string) {
        return this.#cache.get(key)
    }

    has(key: string) {
        return this.#cache.has(key)
    }

    get size() {
        return this.#cache.size
    }
}
