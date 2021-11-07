import { useContext, useEffect, useMemo, useState, createContext } from 'react'
import { initializeApp, getApp, getApps } from 'firebase/app'

import Axios, { AxiosInstance } from 'axios'
import type { Liff } from '@liff/liff-types'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { logEvent, getAnalytics } from 'firebase/analytics'

const liffId = '1653826193-QbmamAo0'
const firebaseConfig = {
    apiKey: 'AIzaSyDbAU9whhvBggCPsVScnZAe5HDpk7N1UVs',
    authDomain: 'thebanana-d9286.firebaseapp.com',
    databaseURL: 'https://thebanana-d9286.firebaseio.com',
    projectId: 'thebanana-d9286',
    storageBucket: 'thebanana-d9286.appspot.com',
    messagingSenderId: '652607083295',
    appId: '1:652607083295:web:33c191031fff9434a9d62a',
    measurementId: 'G-FFJ2NRF8KK',
}

export type AppContext = { $liff?: Liff; $axios?: AxiosInstance }
const appContext = createContext<AppContext>(null)

export const useLiff = () => {
    const { $liff } = useContext(appContext)
    return useMemo(() => $liff, [$liff])
}

export const useAxios = () => {
    const { $axios } = useContext(appContext)
    return useMemo(() => $axios, [$axios])
}

export const useFirebase = () =>
    useMemo(() => {
        const app = getApp()
        if (!app) return null

        return {
            db: getFirestore(app),
            auth: getAuth(app),
        }
    }, [])

const RootContext: React.FC = ({ children }) => {
    const [context, setContext] = useState<AppContext>({
        $axios: null,
        $liff: null,
    })

    useEffect(() => {
        if (getApps().length === 0) {
            initializeApp(firebaseConfig)

            const analytic = getAnalytics()
            logEvent(analytic, 'notification_received')
            console.log('firebase initilized')

            import('@line/liff')
                .then(async ({ default: $liff }) => {
                    await $liff.init({ liffId })
                    await $liff.ready
                    if (!$liff.isLoggedIn()) {
                        $liff.login()
                    }

                    const $axios = Axios.create({
                        headers: {
                            Authorization: `Bearer ${$liff.getAccessToken()}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000,
                    })
                    return { $liff, $axios }
                })
                .then(async ({ $liff, $axios }) => {
                    const { sub: connectId } = $liff.getDecodedIDToken()
                    const memberResult = await $axios.post<{ isMember: boolean }>('/api/auth/member', {
                        connectId,
                    })

                    if (memberResult) {
                        const authenResult = await $axios.post<{ authenticationCode: string }>('/api/auth/token', {
                            connectId,
                        })
                        await signInWithCustomToken(getAuth(), authenResult.data.authenticationCode)
                    }

                    return { $liff, $axios }
                })
                .then(({ $liff, $axios }) => setContext((state) => ({ ...state, $liff, $axios })))
        }
        return getAuth().onIdTokenChanged((user) => {
            console.log(user)
        })()
    }, [])

    const shouldReleased = !!context.$liff && !!context.$axios

    return (
        <appContext.Provider value={context}>
            {!shouldReleased && <div>Loading</div>}
            {shouldReleased && children}
        </appContext.Provider>
    )
}

export default RootContext
