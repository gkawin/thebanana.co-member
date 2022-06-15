import { useContext, useEffect, useMemo, useState, createContext } from 'react'
import { initializeApp, getApps } from 'firebase/app'

import axios, { AxiosInstance } from 'axios'
import { getDoc, getDocs, getFirestore } from 'firebase/firestore'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { logEvent, getAnalytics } from 'firebase/analytics'
import Script from 'next/script'
import { useRouter } from 'next/router'

import { Liff } from '@liff/liff-types'
import { useLoading } from './LoadingContext'
import { addrCollection, schoolCollection, userDoc } from '@/concerns/query'
import { UserAddressModel, UserModelV2 } from '@thebanana/core/lib/models'

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

export const useAxios = () => {
    const { $axios } = useContext(appContext)
    return useMemo(() => $axios, [$axios])
}

export const useUser = () => {
    const ctx = useContext(appContext)
    if (!ctx.alreadyMember && !ctx.initilized) throw Error('Please Login')
    return useMemo(() => ({ ...ctx.$userInfo, alreadyMember: ctx.alreadyMember }), [ctx.$userInfo, ctx.alreadyMember])
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

const createAxios = (token: string) => {
    const instance = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    })
    return instance
}

const RootContext: React.FC = ({ children }) => {
    const { loaded, loading } = useLoading()
    const [context, setContext] = useState<AppContext>({
        $userInfo: { addresses: [], personal: null, schools: [], uid: null, lineProfile: null },
        alreadyMember: false,
        $axios: null,
        authenticationCode: null,
        initilized: false,
    })
    const router = useRouter()

    useEffect(() => {
        if (getApps().length === 0 && window.liff) {
            initializeApp(firebaseConfig)

            const analytic = getAnalytics()
            const auth = getAuth()
            logEvent(analytic, 'notification_received')
            console.log('firebase initilized')

            loading()

            createLiff()
                .then(async () => {
                    const decodedToken = window.liff.getDecodedIDToken()
                    const { data } = await axios.post<AuthenticationResponse>('/api/auth/token', {
                        socialId: decodedToken?.sub,
                    })
                    return { authentication: data }
                })
                .then(async ({ authentication: { alreadyMember, authenticationCode } }) => {
                    if (alreadyMember) {
                        await signInWithCustomToken(auth, authenticationCode)
                    } else {
                        router.push('/signup')
                    }
                    setContext((state) => ({ ...state, alreadyMember, initilized: true }))
                    return { alreadyMember, authenticationCode }
                })
                .finally(() => loaded())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const unsubcriber = getAuth().onAuthStateChanged(async (user) => {
            console.log(user)
            if (user) {
                const db = getFirestore()
                const token = await user.getIdToken()
                const axiosInstance = createAxios(token)

                const addresses = (await getDocs(addrCollection(db, user.uid))).docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                const personal = (await getDoc(userDoc(db, user.uid))).data()
                const schools = (await getDocs(schoolCollection(db, user.uid))).docs.map((doc) => doc.data())
                const lineProfile = await window.liff.getProfile()

                setContext({
                    $axios: axiosInstance,
                    alreadyMember: true,
                    $userInfo: {
                        addresses,
                        personal,
                        schools,
                        uid: user.uid,
                        lineProfile,
                    },
                    authenticationCode: null,
                    initilized: true,
                })
            }
        })
        return () => {
            unsubcriber()
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
            <appContext.Provider value={context}>{context.initilized && children}</appContext.Provider>
        </>
    )
}

export default RootContext
