/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/CSE2004_website2',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
