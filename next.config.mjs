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
  // Skip static generation for pages that use Auth0 context
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
