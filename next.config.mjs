/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  serverExternalPackages: ['@auth0/nextjs-auth0'],
  experimental: {
    serverComponentsExternalPackages: ['@auth0/nextjs-auth0'],
  },
};

export default nextConfig;
