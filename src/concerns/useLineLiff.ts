import type { LiffCore } from '@line/liff/dist/lib/liff'
import { useEffect, useState } from 'react'

export type LineUserProfile = Unpromise<ReturnType<LiffCore['getProfile']>>

export const useLineLiff = (liffId: string, redirectUri?: string) => {
    const [userProfile, setUserProfile] = useState<LineUserProfile>()
    useEffect(() => {
        function initLiff() {
            window.liff
                .init({ liffId })
                .then(() => {
                    if (!window.liff.isLoggedIn()) {
                        window.liff.login({ redirectUri })
                    }
                })
                .then(window.liff.getProfile)
                .then((profile) => setUserProfile(profile))
        }
        if (!userProfile) {
            initLiff()
        }
    }, [liffId, redirectUri])
    return userProfile
}
