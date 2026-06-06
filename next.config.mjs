/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow LAN access during `next dev` without the cross-origin warning.
  allowedDevOrigins: ["192.168.1.193"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
