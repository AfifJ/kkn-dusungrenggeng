/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Remove unoptimized: true to enable Next.js image optimization
    // unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Enable compression
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
