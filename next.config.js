/**
 * @type {import('next').NextConfig}
 */
const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
    images: {
        loader: 'default',
        domains: ['fakeimg.pl', 'firebasestorage.googleapis.com'],
    },
    assetPrefix: isProd ? 'https://member.thebanana.co' : '',
    // experimental: {
    //     outputStandalone: true,
    // },
}
module.exports = nextConfig
