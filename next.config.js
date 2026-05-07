/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['websitelaunches.com'],
    unoptimized: true,
  },
}
module.exports = nextConfig
