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
                <title>หน้าสมาชิก</title>
            </Head>
            <RootContext>
                <main className="max-w-6xl container mx-auto" style={{ minWidth: '20rem' }}>
                    <Component {...pageProps} />
                </main>
            </RootContext>
        </>
    )
}

export default MyApp
