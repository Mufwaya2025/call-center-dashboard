/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static files for Electron
  output: 'export',
  
  // Set output directory for Electron
  distDir: '../app',
  
  // Disable server-side rendering for Electron
  experimental: {
    esmExternals: false,
  },
  
  // Configure asset prefix for Electron
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
  
  // Configure images for Electron
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  
  // Configure webpack for Electron
  webpack: (config, { isServer }) => {
    // Add support for Electron modules
    if (!isServer) {
      config.target = 'electron-renderer'
    }
    
    // Add any additional webpack configuration here
    return config
  },
  
  // Configure compression
  compress: true,
  
  // Configure powered by header
  poweredByHeader: false,
  
  // Generate ETags
  generateEtags: false,
  
  // Configure trailing slash
  trailingSlash: false,
}

module.exports = nextConfig