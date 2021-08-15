import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class AppDoc extends Document {
    render() {
        return (
            <Html lang="th">
                <Head>
                    <link rel="canonical" href="https://www.thebanana.co" />
                    <link rel="alternate" href="https://www.thebanana.co" hrefLang="th-th" />
                    <script charSet="utf-8" src="https://static.line-scdn.net/liff/edge/versions/2.11.0/sdk.js" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
