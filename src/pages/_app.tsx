import '@/styles/globals.css'
import RootContext from '@/core/RootContext'
import type { AppProps } from 'next/app'

import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
                    integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
                <title>หน้าสมาชิก</title>
            </Head>
            <RootContext>
                <Component {...pageProps} />
            </RootContext>
        </>
    )
}

export default MyApp
