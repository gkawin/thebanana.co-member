import '../styles/globals.css'
import RootContext from 'packages/web/src/core/RootContext'
import Head from 'next/head'
import App, { AppContext, AppProps } from 'next/app'
import { createElement } from 'react'
import ReactModal from 'react-modal'
import LoadingContext from 'packages/web/src/core/LoadingContext'

ReactModal.setAppElement('#__next')

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <title>หน้าสมาชิก</title>
            </Head>
            <LoadingContext>
                <RootContext>{createElement(Component, pageProps)}</RootContext>
            </LoadingContext>
        </>
    )
}

MyApp.getInitialProps = async (context: AppContext) => {
    const pageProps = await App.getInitialProps(context)

    return pageProps
}
