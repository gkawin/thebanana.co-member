import '../styles/globals.css'
import RootContext from '@/core/RootContext'

import Head from 'next/head'

import ReactModal from 'react-modal'

ReactModal.setAppElement('#__next')

function MyApp({ Component, pageProps }: any) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <title>หน้าสมาชิก</title>
            </Head>
            <RootContext>
                <Component {...pageProps} />
            </RootContext>
        </>
    )
}

export default MyApp
