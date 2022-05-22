import { useContext, useEffect, useMemo, useState, createContext, useCallback } from 'react'
import { initializeApp, getApp, getApps } from 'firebase/app'

import Axios, { AxiosInstance } from 'axios'
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { logEvent, getAnalytics } from 'firebase/analytics'
import { SpinLoading } from '@/components/portal/SpinLoading'
import { UserModel } from '@/models/UserModel'
import Script from 'next/script'
import { useRouter } from 'next/router'

const liffId = '1653826193-QbmamAo0'
const firebaseConfig = {
    apiKey: 'AIzaSyA0jgSwsfOagPehdRrzbposqkYIn2mHnF8',
    authDomain: 'thebanana-member.firebaseapp.com',
    projectId: 'thebanana-member',
    storageBucket: 'thebanana-member.appspot.com',
    messagingSenderId: '696744791245',
    appId: '1:696744791245:web:c46ca8c522c7f8b301ad84',
    measurementId: 'G-8BXSYMCMDH',
}

export type AppContext = {
    $axios?: AxiosInstance
    $userInfo: { addresses: any[]; schools: any[]; personal: UserModel }
    alreadyMember: boolean
}

export type AuthenticationResponse = { authenticationCode: string; alreadyMember: boolean }

const appContext = createContext<AppContext>(null)
const loadingContext = createContext<{ loading: boolean; setLoading: (val: boolean) => void }>(null)

export const useAxios = () => {
    const { $axios } = useContext(appContext)
    return useMemo(() => $axios, [$axios])
}

export const useFirebase = () =>
    useMemo(() => {
        const apps = getApps()
        if (apps.length === 0) return null

        const app = getApp()

        return {
            db: getFirestore(app),
            auth: getAuth(app),
        }
    }, [])

export const useUser = () => {
    const ctx = useContext(appContext)
    return useMemo(() => ctx.$userInfo, [ctx.$userInfo])
}

export const useLoading = () => {
    const loadingCtx = useContext(loadingContext)

    if (!loadingCtx) {
        throw new Error('no context')
    }

    return loadingCtx
}

const createLiff = async () => {
    if (window.liff) {
        await window.liff.init({ liffId })
        await window.liff.ready
        if (!window.liff.isLoggedIn()) {
            window.liff.login()
        }
    }
}

const createAxios = async () => {
    if (!window.liff) return null
    const token = window.liff.getAccessToken()
    const instance = Axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    })
    return instance
}

const RootContext: React.FC = ({ children }) => {
    const [context, setContext] = useState<AppContext>({ $userInfo: null, alreadyMember: false, $axios: null })
    const [loading, setLoading] = useState<boolean>(true)

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
        if (getApps().length === 0 && window.liff) {
            initializeApp(firebaseConfig)

            const analytic = getAnalytics()
            const auth = getAuth()
            logEvent(analytic, 'notification_received')
            console.log('firebase initilized')

            createLiff()
                .then(createAxios)
                .then(async (axios) => {
                    const decodedToken = window.liff.getDecodedIDToken()
                    const { data } = await axios.post<AuthenticationResponse>('/api/auth/token', {
                        socialId: decodedToken?.sub,
                    })
                    return { authentication: data, axios }
                })
                .then(async ({ authentication: { alreadyMember, authenticationCode }, axios }) => {
                    setContext((state) => ({ ...state, $axios: axios, alreadyMember }))
                    if (alreadyMember) {
                        await signInWithCustomToken(auth, authenticationCode)
                    }
                    return { alreadyMember, authenticationCode }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [])

    useEffect(() => {
        if (context.alreadyMember && !loading) {
            return getAuth().onAuthStateChanged(async (user) => {
                console.log(user)
                if (user) {
                    const userInfo = await createdFetchingUserInfo(user.uid)
                    setContext((state) => ({ ...state, $userInfo: userInfo }))
                }
            })
        }
        return () => {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.alreadyMember, loading])

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
