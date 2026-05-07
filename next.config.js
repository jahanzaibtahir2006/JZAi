/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['websitelaunches.com'],
    unoptimized: true,
  },
}
module.exports = nextConfig
