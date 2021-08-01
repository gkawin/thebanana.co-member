import React, { useContext, useMemo } from 'react'
import { useEffect } from 'react'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import firebase from 'firebase/app'

const configuration = {
    apiKey: 'AIzaSyATnPYkvNTs33CHelSgtE1iUUhMVrTn8YM',
    authDomain: 'thebanana-d9286.firebaseapp.com',
    databaseURL: 'https://thebanana-d9286.firebaseio.com',
    projectId: 'thebanana-d9286',
    storageBucket: 'thebanana-d9286.appspot.com',
    messagingSenderId: '652607083295',
    appId: '1:652607083295:web:33c191031fff9434a9d62a',
    measurementId: 'G-FFJ2NRF8KK',
}

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
        }
    }, [configuration])

    return <FirebaseContext.Provider value={firebase}>{children}</FirebaseContext.Provider>
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext)
    if (!context) throw new Error('use Firebase must be used with FirebaseApp Provider')
    return useMemo(() => context, [context])
}
