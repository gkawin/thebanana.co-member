import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class AppDoc extends Document {
    render() {
        return (
            <Html lang="th">
                <Head>
                    <link rel="canonical" href="https://www.thebanana.co" />
                    <link rel="alternate" href="https://www.thebanana.co" hrefLang="th-th" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <body>
                    <Main />
                    <div id="portal" />
                    <NextScript />
                </body>
            </Html>
        )
    }
}