/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    //Enable images from shopify
    domains: [process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN, "cdn.shopify.com"],
  },
  experimental: { images: { allowFutureImage: true } },
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
