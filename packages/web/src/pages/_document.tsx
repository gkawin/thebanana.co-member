/* eslint-disable @next/next/no-sync-scripts */
import Document, { Head, Html, Main, NextScript } from 'next/document'

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
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <div id="portal"></div>
                </body>
            </Html>
        )
    }
}
