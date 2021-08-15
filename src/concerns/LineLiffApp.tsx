import { userService } from '@/services'
import type { LiffCore } from '@line/liff/dist/lib/liff'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

export type LineUserProfile = Unpromise<ReturnType<LiffCore['getProfile']>>

export const LineLiffContext = createContext<LineUserProfile | null>(null)

export const LineLiffProvider: React.FC<{ liffId: string }> = ({ liffId, children }) => {
    const [lineProfile, setLineProfile] = useState<LineUserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!lineProfile) {
            window.liff
                .init({ liffId })
                .then(() => {
                    if (!window.liff.isLoggedIn()) {
                        window.liff.login()
                    }
                })
                .then(window.liff.getProfile)
                .then(async ({ userId, ...props }) => {
                    const isRegistered = await userService.getLoginToken(userId)
                    if (isRegistered) return { userId, ...props }
                    return null
                })
                .then((profile) => {
                    setLineProfile(profile)
                })
                .catch(console.error)
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [liffId])

    return (
        <LineLiffContext.Provider value={lineProfile}>
            <Dimmer active={loading} inverted>
                <Loader size="huge">Loading</Loader>
            </Dimmer>
            {children}
        </LineLiffContext.Provider>
    )
}

export const useLineProfile = () => {
    const lineProfile = useContext(LineLiffContext)
    return useMemo(() => lineProfile, [lineProfile])
}
