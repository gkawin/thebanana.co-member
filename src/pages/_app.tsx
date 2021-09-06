import '../styles/globals.css'
import type { AppProps } from 'next/app'

import React from 'react'
import Head from 'next/head'

import UserProvider from '@/concerns/UserProvider'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <title>หน้าสมาชิก</title>
            </Head>
            <UserProvider>
                <Component {...pageProps} />
            </UserProvider>
        </React.Fragment>
    )
}
export default MyApp
