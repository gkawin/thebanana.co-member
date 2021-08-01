import React, { useContext, useMemo } from 'react'
import { useEffect } from 'react'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import firebase from 'firebase/app'

interface FirebaseAppProps {
    configuration: Record<string, any>
}

const FirebaseContext = React.createContext<typeof firebase>(null as unknown as typeof firebase)

export const FirebaseApp: React.FC<FirebaseAppProps> = ({ children, configuration }) => {
    useEffect(() => {
        let unsubscribe = () => {}
        if (firebase.apps.length === 0) {
            console.log('initailzed')
            firebase.initializeApp(configuration)
            firebase.auth().languageCode = 'th'
            if (process.env.NODE_ENV !== 'development') {
                firebase.analytics().logEvent('notification_received')
            }

            unsubscribe = firebase.auth().onIdTokenChanged((user) => {
                console.log(user)
            })
        }
        return () => unsubscribe()
    }, [configuration])

    return <FirebaseContext.Provider value={firebase}>{children}</FirebaseContext.Provider>
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext)
    if (!context) throw new Error('use Firebase must be used with FirebaseApp Provider')
    return useMemo(() => context, [context])
}
