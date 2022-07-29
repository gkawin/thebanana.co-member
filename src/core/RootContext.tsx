import { useContext, useEffect, useMemo, useState, createContext, PropsWithChildren } from 'react'
import { initializeApp, getApps } from 'firebase/app'

import axios, { AxiosInstance } from 'axios'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { logEvent, getAnalytics } from 'firebase/analytics'
import { UserModelV2 } from '@/models/user/user.model'
import { UserAddressModel } from '@/models/UserAddressModel'
import { Liff } from '@liff/liff-types'

import { SpinLoading } from '@/components/portal/SpinLoading'
import { Curtain } from '@/components/portal/Curtain'
import SignUpPage from '@/components/signup/SignupPage'

const liffId = '1653826193-QbmamAo0'
const firebaseConfig = {
    apiKey: 'AIzaSyABewxwss6AP3bH5YDPfSJ1ZiYNPGkJ8Rs',
    authDomain: 'prod-member-thebanana-co.firebaseapp.com',
    projectId: 'prod-member-thebanana-co',
    storageBucket: 'prod-member-thebanana-co.appspot.com',
    messagingSenderId: '560154323667',
    appId: '1:560154323667:web:17b5cff2ede9bc4ffd0226',
    measurementId: 'G-KPYSRNLGFX',
}

export type AppContext = {
    $axios?: AxiosInstance
    $userInfo: {
        addresses?: UserAddressModel[]
        schools?: any[]
        personal?: UserModelV2
        uid: string
        lineProfile?: Unpromise<ReturnType<Liff['getProfile']>>
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
    return useMemo(() => ({ uid: ctx.$userInfo.uid, profile: ctx.$userInfo.lineProfile }), [ctx.$userInfo])
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

const RootContext: React.FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setLoading] = useState(true)

    const [context, setContext] = useState<AppContext>({
        $userInfo: { addresses: [], personal: null, schools: [], uid: null, lineProfile: null },
        alreadyMember: false,
        $axios: null,
        authenticationCode: null,
        initilized: false,
    })

    useEffect(() => {
        if (getApps().length === 0 && window.liff) {
            initializeApp(firebaseConfig)
            const analytic = getAnalytics()
            const auth = getAuth()
            logEvent(analytic, 'notification_received')

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
                    }
                    setContext((state) => ({ ...state, alreadyMember, initilized: true }))
                })
                .finally(() => {
                    console.log('firebase initilized')
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!context.initilized) return () => {}

        const unsubcriber = getAuth().onAuthStateChanged(async (user) => {
            console.log(user)
            if (user) {
                const token = await user.getIdToken()
                const axiosInstance = createAxios(token)

                const lineProfile = await window.liff.getProfile()

                setContext((state) => ({
                    ...state,
                    alreadyMember: true,
                    $axios: axiosInstance,
                    $userInfo: { uid: user.uid, lineProfile },
                }))
            }
            setLoading(false)
        })
        return () => {
            unsubcriber()
        }
    }, [context.initilized])

    return (
        <appContext.Provider value={context}>
            {isLoading && (
                <Curtain>
                    <SpinLoading />
                </Curtain>
            )}
            {context.initilized && !isLoading && context.alreadyMember && children}
            {context.initilized && !context.alreadyMember && <SignUpPage />}
        </appContext.Provider>
    )
}

export default RootContext
