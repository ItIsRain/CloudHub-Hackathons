/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Image optimization is now enabled by removing 'unoptimized: true'
  },
  // Enable React strict mode for better development experience and performance
  reactStrictMode: true,
  // Enable gzip compression for better performance
  compress: true,
  // Optimize output for production builds
  swcMinify: true,
  // Improve performance by disabling unused features when not needed
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizeServerReact: true, // Optimize server-side rendering for React components
  },
  // Add trailing slashes for better SEO and caching
  trailingSlash: true,
  // Improve performance with faster builds
  output: "standalone",
}

export default nextConfig
