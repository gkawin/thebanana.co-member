import { userService } from '@/services'
import type { LiffCore } from '@line/liff/dist/lib/liff'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { useRef } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

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
                .then(async () => {
                    const lineProfile = await window.liff.getProfile()
                    setLineProfile(lineProfile)
                })
                .catch(console.error)
                .finally(() => setLoading(false))
        }
    }, [liffId])

    return (
        <LineLiffContext.Provider value={lineProfile}>
            <Backdrop open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {children}
        </LineLiffContext.Provider>
    )
}

export const useLineProfile = () => {
    const lineProfile = useContext(LineLiffContext)
    return useMemo(() => lineProfile, [lineProfile])
}
