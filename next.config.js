/**
 * @type {import('next').NextConfig}
 */
const config = {
    images: {
        domains: ['firebasestorage.googleapis.com', 'fakeimg.pl'],
    },
    env: {
        NEXT_RUNTIME__ENV: process.env.NODE_ENV,
    },
}

module.exports = config
