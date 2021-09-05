import React, { useContext, useMemo } from 'react'
import { useEffect } from 'react'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import firebase from 'firebase/app'
import { useLineProfile } from './LineLiffApp'
import { useState } from 'react'
import { userService } from '@/services'
import { ok } from 'assert'
import { Boom, notFound } from '@hapi/boom'

interface FirebaseProviderProps {
    configuration: Record<string, any>
}

const FirebaseContext = React.createContext<typeof firebase>(null as unknown as typeof firebase)

export type UserProfile = { userId: string | null; email: string | null; photoURL: string | null }

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children, configuration }) => {
    const lineProfile = useLineProfile()
    const [userProfile, setUserProfile] = useState<UserProfile>({
        userId: null,
        email: null,
        photoURL: null,
    })

    useEffect(() => {
        let unsubscribe = () => {}
        if (firebase.apps.length === 0) {
            console.log('initailzed')
            firebase.initializeApp(configuration)
            firebase.auth().languageCode = 'th'
            if (process.env.NODE_ENV !== 'development') {
                firebase.analytics().logEvent('notification_received')
            }
        }
        return () => unsubscribe()
    }, [configuration])

    useEffect(() => {
        if (!lineProfile) return () => {}

        userService
            .getLoginToken(lineProfile.userId)
            .then(({ token }) => {
                return firebase.auth().signInWithCustomToken(token)
            })
            .catch((error: Boom) => {
                console.log(error)
            })

        return firebase.auth().onIdTokenChanged((user) => {
            if (user) {
                setUserProfile({ userId: user.uid, email: user.email, photoURL: user.photoURL })
            }
        })()
    }, [lineProfile])

    return <FirebaseContext.Provider value={firebase}>{children}</FirebaseContext.Provider>
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext)
    if (!context) throw new Error('use Firebase must be used with FirebaseApp Provider')
    return useMemo(() => context, [context])
}
