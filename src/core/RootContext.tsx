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
import { getDoc, getDocs, getFirestore } from 'firebase/firestore'
import { schoolCollection, userDoc } from '@/concerns/query'

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
    loading: VoidFunction
    loaded: VoidFunction
    isLoading: boolean
} & AuthenticationResponse

export type AuthenticationResponse = { authenticationCode: string; alreadyMember: boolean }

export const appContext = createContext<AppContext>(null)

export const useAxios = () => {
    const { alreadyMember, initilized, loaded, loading, authenticationCode } = useContext(appContext)
    const notReady = !alreadyMember || !initilized

    if (notReady) throw new Error('Need register')

    const instance = axios.create({
        headers: {
            Authorization: `Bearer ${authenticationCode}`,
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    })

    instance.interceptors.request.use((ctx) => {
        console.log('test')
        loading()
        return ctx
    })
    instance.interceptors.response.use((ctx) => {
        loaded()
        return ctx
    })

    return useMemo(() => instance, [instance])
}

export const useUserInfo = () => {
    const ctx = useContext(appContext)
    if (!ctx.alreadyMember && !ctx.initilized) throw Error('Please Login')

    return useMemo(
        () => ({
            uid: ctx.$userInfo.uid,
            profile: ctx.$userInfo.lineProfile,
            personal: ctx.$userInfo.personal,
            schools: ctx.$userInfo.schools,
        }),

        [ctx.$userInfo.lineProfile, ctx.$userInfo.personal, ctx.$userInfo.schools, ctx.$userInfo.uid]
    )
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

const RootContext: React.FC<PropsWithChildren> = ({ children }) => {
    const [isLoading, setLoading] = useState(true)
    const [context, setContext] = useState<AppContext>({
        $userInfo: null,
        alreadyMember: false,
        authenticationCode: null,
        initilized: false,
        loaded: () => setLoading(false),
        loading: () => setLoading(true),
        isLoading,
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
                    setContext((state) => ({ ...state, authenticationCode, alreadyMember, initilized: true }))
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
            if (user) {
                const lineProfile = await window.liff.getProfile()
                const db = getFirestore()
                const createQueryUserInfo = getDoc(userDoc(db, user.uid))
                const createQuerySchools = getDocs(schoolCollection(db, user.uid))
                const [personal, schools] = await Promise.all([createQueryUserInfo, createQuerySchools])

                setContext((state) => ({
                    ...state,
                    alreadyMember: true,
                    $userInfo: {
                        uid: user.uid,
                        lineProfile,
                        personal: personal.data(),
                        schools: schools.docs.map((doc) => doc.data()),
                    },
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
            {!context.initilized && (
                <Curtain>
                    <SpinLoading isLoading />
                </Curtain>
            )}
            {context.initilized && context.alreadyMember && context.$userInfo !== null && children}
            {context.initilized && !context.alreadyMember && <SignUpPage />}
        </appContext.Provider>
    )
}

export default RootContext
