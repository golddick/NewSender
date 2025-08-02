/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.beehiiv.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: '/f/**',
      },
      // Add this new pattern for UploadThing's storage domain
      {
        protocol: "https",
        hostname: "*.ufs.sh", // This will cover all UploadThing subdomains
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "deg9tan1ik.ufs.sh",
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;