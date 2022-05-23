import { useContext, useEffect, useMemo, useState, createContext } from 'react'
import { initializeApp, getApp, getApps } from 'firebase/app'

import Axios, { AxiosInstance } from 'axios'
import { getDoc, getDocs, getFirestore } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { logEvent, getAnalytics } from 'firebase/analytics'
import { SpinLoading } from '@/components/portal/SpinLoading'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { UserModelV2 } from '@/models/user/user.model'
import { addrCollection, schoolCollection, userDoc } from '@/concerns/query'
import { UserAddressModel } from '@/models/UserAddressModel'
import { Liff } from '@liff/liff-types'

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
    $userInfo: {
        addresses: UserAddressModel[]
        schools: any[]
        personal: UserModelV2
        uid: string
        lineProfile: Unpromise<ReturnType<Liff['getProfile']>>
    }
    initilized: boolean
} & AuthenticationResponse

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
    const [context, setContext] = useState<AppContext>({
        $userInfo: { addresses: [], personal: null, schools: [], uid: null, lineProfile: null },
        alreadyMember: false,
        $axios: null,
        authenticationCode: null,
        initilized: false,
    })
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()

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
                    if (alreadyMember) {
                        await signInWithCustomToken(auth, authenticationCode)
                    } else {
                        router.push('/signup')
                    }

                    setContext((state) => ({ ...state, $axios: axios, alreadyMember, initilized: true }))
                    return { alreadyMember, authenticationCode }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return getAuth().onAuthStateChanged(async (user) => {
            console.log(user)
            if (user) {
                const db = getFirestore()

                const addresses = (await getDocs(addrCollection(db, user.uid))).docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                const personal = (await getDoc(userDoc(db, user.uid))).data()
                const schools = (await getDocs(schoolCollection(db, user.uid))).docs.map((doc) => doc.data())
                const lineProfile = await window.liff.getProfile()

                console.log(lineProfile)

                setContext((state) => ({
                    ...state,
                    $userInfo: {
                        addresses,
                        personal,
                        schools,
                        uid: user.uid,
                        lineProfile,
                    },
                }))
            }
        })()
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
                    {context.initilized && children}
                </appContext.Provider>
            </loadingContext.Provider>
        </>
    )
}

export default RootContext
