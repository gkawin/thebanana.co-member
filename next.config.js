/**
 * @type {import('next').NextConfig}
 */
const config = {
    images: {
        domains: ['firebasestorage.googleapis.com', 'fakeimg.pl'],
    },
    env: {
        NEXT_RUNTIME__APP_STAGE: process.env.APP_STAGE,
        NEXT_RUNTIME__OMISE_PUBLIC_KEY: process.env.OMISE_PUBLIC_KEY,
    },
}

module.exports = config
