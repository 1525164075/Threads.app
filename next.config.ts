import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors: true
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ]
}
}

export default nextConfig;
