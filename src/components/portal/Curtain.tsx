import type { PropsWithChildren } from 'react'
import { Portal } from './Portal'

export const Curtain: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Portal>
            <div className="h-screen w-screen fixed top-0 left-0 bg-opacity-80 bg-gray-300">
                <div className="relative">{children}</div>
            </div>
        </Portal>
    )
}
