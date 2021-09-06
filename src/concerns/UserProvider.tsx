import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/analytics'

import type { LiffCore } from '@line/liff/dist/lib/liff'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { useContext, useEffect, useMemo, useState } from 'react'
import { createContext } from 'react'
import firebase from 'firebase/compat/app'
import { userService } from '@/services'
import { forbidden } from '@hapi/boom'

type LineUserProfile = Unpromise<ReturnType<LiffCore['getProfile']>>

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
interface IUserContextType extends LineUserProfile {
    isLoggedIn: boolean
}

export const initialUserState: IUserContextType = { isLoggedIn: false, displayName: null, userId: null }
export const UserContext = createContext<IUserContextType>(initialUserState)
export const liffId = '1653826193-QbmamAo0'

export const useProfile = () => {
    const lineProfile = useContext(UserContext)
    return useMemo(() => lineProfile, [lineProfile])
}

const UserProvider: React.FC = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(initialUserState)

    useEffect(() => {
        if (firebase.apps.length === 0 && window.liff) {
            firebase.initializeApp(firebaseConfig)
            firebase.auth().languageCode = 'th'
            firebase.analytics().logEvent('notification_received')
            console.log('firebase initilized')
            window.liff.init({ liffId })
        }
    }, [])

    useEffect(() => {
        let unsubscribe = () => {}
        if (firebase.apps.length > 0 && !profile.isLoggedIn) {
            window.liff.ready
                .then(() => {
                    if (!window.liff.isLoggedIn()) {
                        window.liff.login()
                    }
                })
                .then(async () => {
                    const { sub: userId } = window.liff.getDecodedIDToken()
                    const result = await userService.getLoginToken(userId)
                    if (!result.token) throw forbidden('access token is invalid.')
                    await firebase.auth().signInWithCustomToken(result.token)
                    console.log('signin successfully')
                })
                .catch(() => {
                    console.error('need register')
                })
                .finally(() => {
                    setLoading(false)
                })

            unsubscribe = firebase.auth().onIdTokenChanged((user) => {
                if (user) {
                    setProfile({ displayName: user.photoURL, isLoggedIn: true, userId: '' })
                }
            })
        }
        return () => {
            unsubscribe()
        }
    }, [profile])

    return (
        <UserContext.Provider value={profile}>
            <Backdrop open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
