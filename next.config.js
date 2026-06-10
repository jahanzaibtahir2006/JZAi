/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox-cdn.paddle.com https://cdn.paddle.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com https://sandbox-cdn.paddle.com https://cdn.paddle.com",
              "style-src-elem 'self' 'unsafe-inline' fonts.googleapis.com https://sandbox-cdn.paddle.com https://cdn.paddle.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: https:",
              "frame-src 'self' https://sandbox-buy.paddle.com https://buy.paddle.com",
              "connect-src 'self' https://sandbox-api.paddle.com https://api.paddle.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
