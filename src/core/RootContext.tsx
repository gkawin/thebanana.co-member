import { useContext, useEffect, useMemo, useState, createContext, useCallback } from 'react'
import { initializeApp, getApp, getApps } from 'firebase/app'

import Axios, { AxiosInstance } from 'axios'
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

export type AppContext = { $axios?: AxiosInstance }
const appContext = createContext<AppContext>(null)

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
    })

    const createLiff = useCallback(async () => {
        const { default: liff } = await import('@line/liff')
        await liff.init({ liffId })
        await liff.ready
        if (!liff.isLoggedIn()) {
            liff.login()
        }
    }, [])

    const createAxios = useCallback(async () => {
        const token = window.liff.getAccessToken()
        return Axios.create({
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        })
    }, [])

    const createAuthorization = useCallback(async () => {
        const axios = await createAxios()
        const { sub: connectId } = window.liff.getDecodedIDToken()
        const memberResult = await axios.post<{ isMember: boolean }>('/api/auth/member', {
            connectId,
        })
        if (memberResult) {
            const authenResult = await axios.post<{ authenticationCode: string }>('/api/auth/token', {
                connectId,
            })
            await signInWithCustomToken(getAuth(), authenResult.data.authenticationCode)
        }
    }, [createAxios])

    useEffect(() => {
        let unsubscribe = () => {}
        if (getApps().length === 0) {
            initializeApp(firebaseConfig)

            const analytic = getAnalytics()
            logEvent(analytic, 'notification_received')
            console.log('firebase initilized')

            createLiff().then(createAxios)

            unsubscribe = getAuth().onAuthStateChanged(async (user) => {
                if (!user) {
                    await createAuthorization()
                } else {
                    console.log(user)
                    const $axios = await createAxios()
                    setContext({ $axios })
                }
            })
        }
        return () => {
            unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!context.$axios) return <div>Loading</div>

    return <appContext.Provider value={context}>{children}</appContext.Provider>
}

export default RootContext
