import { lineService, userService } from '@/services'
import type { LiffCore } from '@line/liff/dist/lib/liff'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type LineUserProfile = Unpromise<ReturnType<LiffCore['getProfile']>>

export const LineLiffContext = createContext<LineUserProfile | null>(null)

export const LineLiffProvider: React.FC<{ liffId: string }> = ({ liffId, children }) => {
    const [lineProfile, setLineProfile] = useState<LineUserProfile | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

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
                    const isRegistered = await userService.isRegistered(userId)
                    if (isRegistered) return { userId, ...props }
                    return null
                })
                .then((profile) => {
                    setIsLoggedIn(window.liff.isLoggedIn())
                    setLineProfile(profile)
                })
                .catch(console.error)
        }
    }, [liffId])

    return (
        <LineLiffContext.Provider value={lineProfile}>
            {!isLoggedIn && <div>กรุณาเข้าสู่ระบบ Line ก่อนการใช้งาน</div>}
            {lineProfile && children}
        </LineLiffContext.Provider>
    )
}

export const useLineProfile = () => {
    const lineProfile = useContext(LineLiffContext)
    return useMemo(() => lineProfile, [lineProfile])
}
