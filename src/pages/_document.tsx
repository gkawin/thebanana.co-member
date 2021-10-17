/* eslint-disable @next/next/no-sync-scripts */
import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class AppDoc extends Document {
    render() {
        return (
            <Html lang="th">
                <Head>
                    <link rel="canonical" href="https://www.thebanana.co" />
                    <link rel="alternate" href="https://www.thebanana.co" hrefLang="th-th" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
