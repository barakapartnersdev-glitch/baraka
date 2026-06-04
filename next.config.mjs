/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // رفع ملفات حتى 20MB عبر إجراءات الخادم
    serverActions: { bodySizeLimit: "25mb" },
  },
};
export default nextConfig;
