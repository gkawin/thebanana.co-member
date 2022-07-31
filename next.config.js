/**
 * @type {import('next').NextConfig}
 */
const config = {
    images: {
        domains: ['firebasestorage.googleapis.com', 'fakeimg.pl'],
    },
    output: 'standalone',
}

module.exports = config
