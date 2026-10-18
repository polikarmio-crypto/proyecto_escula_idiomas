/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8000';
const quarkusUrl = process.env.QUARKUS_INTERNAL_URL || 'http://localhost:8080';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`
      },
      {
        source: '/api/quarkus/:path*',
        destination: `${quarkusUrl}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
