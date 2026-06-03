/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',   // static export — deploy as pure static files, no server needed
  trailingSlash: true, // generates /dashboard/index.html instead of /dashboard.html
  images: {
    unoptimized: true, // required for static export (no Image Optimization API)
  },
}
module.exports = nextConfig
