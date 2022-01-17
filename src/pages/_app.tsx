/* eslint-disable @next/next/no-sync-scripts */
import 'reflect-metadata'
import '@/styles/globals.css'
import RootContext from '@/core/RootContext'
import type { AppProps } from 'next/app'

import Head from 'next/head'

import ReactModal from 'react-modal'

ReactModal.setAppElement('#__next')

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <title>หน้าสมาชิก</title>
                <script charSet="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
            </Head>
            <RootContext>
                <Component {...pageProps} />
            </RootContext>
        </>
    )
}

export default MyApp
