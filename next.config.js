/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN, "cdn.shopify.com", "c10.patreonusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/',
        permanent: true
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/fonts/EduFavorit/EduFavorit-Regular.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
