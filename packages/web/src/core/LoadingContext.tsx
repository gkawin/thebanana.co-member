import { SpinLoading } from 'packages/web/src/components/portal/SpinLoading'
import { createContext, useContext, useState } from 'react'

const loadingContext = createContext<{ isLoading: boolean; loaded: VoidFunction; loading: VoidFunction }>(null)

const LoadingContext: React.FC = ({ children }) => {
    const [isLoading, setLoading] = useState(false)
    const loaded = () => setLoading(false)
    const loading = () => setLoading(true)
    return (
        <loadingContext.Provider value={{ isLoading, loaded, loading }}>
            <SpinLoading global />
            {children}
        </loadingContext.Provider>
    )
}

export const useLoading = () => {
    const loadingCtx = useContext(loadingContext)

    if (!loadingCtx) {
        throw new Error('no context')
    }

    return loadingCtx
}

export default LoadingContext
