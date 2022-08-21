import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default class AppDoc extends Document {
    render() {
        return (
            <Html lang="th">
                <Head>
                    <link rel="canonical" href="https://www.thebanana.co" />
                    <link rel="alternate" href="https://www.thebanana.co" hrefLang="th-th" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="crossOrigin" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;600&display=swap"
                        rel="stylesheet"
                    />
                    <Script
                        charSet="utf-8"
                        src="https://static.line-scdn.net/liff/edge/2/sdk.js"
                        strategy="beforeInteractive"
                    ></Script>
                </Head>
                <body>
                    <Main />
                    <div id="portal"></div>
                    <NextScript />
                </body>
            </Html>
        )
    }
}
