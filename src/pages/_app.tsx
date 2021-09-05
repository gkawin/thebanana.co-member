import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { FirebaseProvider } from '../concerns/FirebaseApp'
import React from 'react'
import Head from 'next/head'
import { LineLiffProvider } from '@/concerns/LineLiffApp'

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

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <title>หน้าสมาชิก</title>
            </Head>
            <LineLiffProvider liffId="1653826193-QbmamAo0">
                <FirebaseProvider configuration={configuration}>
                    <Component {...pageProps} />
                </FirebaseProvider>
            </LineLiffProvider>
        </React.Fragment>
    )
}
export default MyApp
