import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/analytics'

import { Backdrop, CircularProgress } from '@mui/material'
import { useContext, useEffect, useMemo, useState, createContext } from 'react'
import firebase from 'firebase/compat/app'

import Axios, { AxiosInstance } from 'axios'
import type { Liff } from '@liff/liff-types'
import { useRouter } from 'next/dist/client/router'

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

const liffContext = createContext<Liff>(null)
const axiosContext = createContext<AxiosInstance>(null)
const authContext = createContext<firebase.User>(null)

export const useLiff = () => {
    const liff = useContext(liffContext)
    if (!liff) throw new Error('liff')
    return useMemo(() => liff, [liff])
}

export const useAxios = () => {
    const axios = useContext(liffContext)
    if (!axios) throw new Error('axios')
    return useMemo(() => axios, [axios])
}

export const useAuth = () => {
    const auth = useContext(authContext)

    return useMemo(() => auth, [auth])
}

const RootContext: React.FC = ({ children }) => {
    const router = useRouter()
    const [context, setContext] = useState<{ $liff?: Liff; $axios?: AxiosInstance; $auth?: firebase.User }>({
        $axios: null,
        $liff: null,
        $auth: null,
    })

    useEffect(() => {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig)
            firebase.auth().languageCode = 'th'
            firebase.analytics().logEvent('notification_received')
            console.log('firebase initilized')

            import('@line/liff').then(async ({ default: $liff }) => {
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
                setContext((state) => ({ ...state, $liff, $axios }))
            })
        }
    }, [])

    useEffect(() => {
        if (!context.$axios || !context.$liff) return () => {}

        async function checkMember() {
            const { sub: connectId } = context.$liff.getDecodedIDToken()

            const memberResult = await context.$axios.post<{ isMember: boolean }>('/api/auth/member', { connectId })

            if (!memberResult.data.isMember && router.pathname !== '/signup') {
                router.push('/signup', undefined, { shallow: true })
            }

            const authenResult = await context.$axios.post<{ authenticationCode: string }>('/api/auth/token', {
                connectId,
            })

            await firebase.auth().signInWithCustomToken(authenResult.data.authenticationCode)
        }

        return firebase.auth().onIdTokenChanged(async (user) => {
            if (!user) await checkMember()
            setContext((state) => ({ ...state, $auth: user }))
        })
    }, [context.$axios, context.$liff, router])

    return (
        <liffContext.Provider value={context.$liff}>
            <axiosContext.Provider value={context.$axios}>
                <authContext.Provider value={context.$auth}>
                    <Backdrop open={!context.$auth && !context.$liff && !context.$axios}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    {!!context.$auth && !!context.$liff && !!context.$axios && children}
                </authContext.Provider>
            </axiosContext.Provider>
        </liffContext.Provider>
    )
}

export default RootContext
