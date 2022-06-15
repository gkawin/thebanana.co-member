const isProd = process.env.NODE_ENV === 'production'
const path = require('path')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    cleanDistDir: true,
    images: {
        loader: 'default',
        domains: ['fakeimg.pl', 'firebasestorage.googleapis.com'],
    },
    assetPrefix: isProd ? 'https://member.thebanana.co' : '',
}
module.exports = nextConfig
