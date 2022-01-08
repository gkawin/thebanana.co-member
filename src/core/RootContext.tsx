import { useContext, useEffect, useMemo, useState, createContext, useCallback } from 'react'
import { initializeApp, getApp, getApps } from 'firebase/app'

import Axios, { AxiosInstance } from 'axios'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { logEvent, getAnalytics } from 'firebase/analytics'
import { SpinLoading } from '@/components/portal/SpinLoading'

const liffId = '1653826193-QbmamAo0'
const firebaseConfig = {
    apiKey: 'AIzaSyDbAU9whhvBggCPsVScnZAe5HDpk7N1UVs',
    authDomain: 'thebanana-d9286.firebaseapp.com',
    databaseURL: 'https://thebanana-d9286.firebaseio.com',
    projectId: 'thebanana-d9286',
    storageBucket: 'thebanana-d9286.appspot.com',
    messagingSenderId: '652607083295',
    appId: '1:652607083295:web:0fc0e776e8bd7d0da9d62a',
    measurementId: 'G-1KLYQ0X2ET',
}

export type AppContext = { $axios?: AxiosInstance }
const appContext = createContext<AppContext>(null)
const loadingContext = createContext<{ loading: boolean; setLoading: (val: boolean) => void }>(null)

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

export const useLoading = (init?: boolean) => {
    const loadingCtx = useContext(loadingContext)

    if (!loadingCtx) {
        throw new Error('no context')
    }

    return loadingCtx
}

const RootContext: React.FC = ({ children }) => {
    const [context, setContext] = useState<AppContext>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const createLiff = useCallback(async () => {
        await window.liff.init({ liffId })
        await window.liff.ready
        if (!window.liff.isLoggedIn()) {
            window.liff.login()
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
                    setLoading(false)
                }
            })
        }
        return () => {
            unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <loadingContext.Provider value={{ loading, setLoading }}>
            <SpinLoading global />
            <appContext.Provider value={context}>{!!context && children}</appContext.Provider>
        </loadingContext.Provider>
    )
}

export default RootContext
