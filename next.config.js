/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://streetpaws-4.onrender.com'
  },
  // RAM optimizations
  trailingSlash: true,
  generateEtags: false,
  poweredByHeader: false
};

module.exports = nextConfig;
