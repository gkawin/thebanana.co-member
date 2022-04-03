import { useContext, useEffect, useMemo, useState, createContext, useCallback } from 'react'
import { initializeApp, getApp, getApps } from 'firebase/app'

import Axios, { AxiosInstance } from 'axios'
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { logEvent, getAnalytics } from 'firebase/analytics'
import { SpinLoading } from '@/components/portal/SpinLoading'
import { UserModel } from '@/models/UserModel'
import Script from 'next/script'

const liffId = '1653826193-QbmamAo0'
const firebaseConfig = {
    apiKey: 'AIzaSyDbAU9whhvBggCPsVScnZAe5HDpk7N1UVs',
    authDomain: 'thebanana-d9286.firebaseapp.com',
    databaseURL: 'https://thebanana-d9286.firebaseio.com',
    projectId: 'thebanana-d9286',
    storageBucket: 'thebanana-d9286.appspot.com',
    messagingSenderId: '652607083295',
    appId: '1:652607083295:web:4b660c65ebc8ceeaa9d62a',
    measurementId: 'G-KQ0RJ6ZTG5',
}

export type AppContext = {
    $axios?: AxiosInstance
    $userInfo: { addresses: any[]; schools: any[]; personal: UserModel }
}
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

export const useUserInfoContext = () => {
    const ctx = useContext(appContext)
    return useMemo(() => ctx.$userInfo, [ctx.$userInfo])
}

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

    const createdFetchingUserInfo = useCallback(async (uid: string) => {
        const db = getFirestore()
        const schoolsRef = getDocs(query(collection(db, 'users', uid, 'school'), orderBy('createdOn', 'desc')))
        const addressesRef = getDocs(query(collection(db, 'users', uid, 'address'), orderBy('createdOn', 'desc')))
        const personalRef = getDoc(doc(db, 'users', uid))

        const [addresses, schools, personal] = await Promise.all([addressesRef, schoolsRef, personalRef])
        return {
            addresses: addresses.empty ? [] : addresses.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            personal: personal.data() as UserModel,
            schools: schools.empty ? [] : schools.docs.map((doc_1) => ({ id: doc_1.id, ...doc_1.data() })),
        }
    }, [])

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
                    const $userInfo = await createdFetchingUserInfo(user.uid)
                    setContext({ $axios, $userInfo })
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
        <>
            <Script
                charSet="utf-8"
                src="https://static.line-scdn.net/liff/edge/2/sdk.js"
                strategy="beforeInteractive"
            ></Script>
            <loadingContext.Provider value={{ loading, setLoading }}>
                <appContext.Provider value={context}>
                    <SpinLoading global />
                    {!!context && children}
                </appContext.Provider>
            </loadingContext.Provider>
        </>
    )
}

export default RootContext
