import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './reducers'

export const store = configureStore({
    reducer: rootReducer,
})

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
    ;(module as any).hot.accept('./reducers', () => {
        const newRootReducer = require('./reducers').rootReducer
        store.replaceReducer(newRootReducer)
    })
}
