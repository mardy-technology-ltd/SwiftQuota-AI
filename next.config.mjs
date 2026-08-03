/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '192.168.0.110',
    '192.168.0.110:3001',
    'localhost:3001',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.0.110:3001', 'localhost:3001'],
    },
  },
};

export default nextConfig;
