/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    images: {
        domains: ['fakeimg.pl', 'firebasestorage.googleapis.com'],
    },
    experimental: {
        outputStandalone: true,
    },
}
module.exports = nextConfig
