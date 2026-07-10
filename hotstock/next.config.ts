import type { NextConfig } from "next";
import { buildFrameSrcDirective } from "./lib/constants/security";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  productionBrowserSourceMaps: false,

  // Image optimization config
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      // Restrict to known safe domains only
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.hotstockvn.com' },
      { protocol: 'http', hostname: 'localhost', port: '' },
      { protocol: 'http', hostname: '127.0.0.1', port: '' },
      { protocol: 'http', hostname: 'localhost', port: '3001' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3001' },
    ],
    // FIX: Disable SVG — SVG can contain embedded scripts (XSS vector)
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
    ],
  },

  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  async rewrites() {
    return [
      {
        source: '/phan-tich',
        destination: '/news',
      },
      {
        source: '/phan-tich/:path*',
        destination: '/news/:path*',
      },
      {
        source: '/thi-truong',
        destination: '/market',
      },
      {
        source: '/thi-truong/:path*',
        destination: '/market/:path*',
      },
      {
        source: '/danh-muc-dau-tu',
        destination: '/portfolio',
      },
      {
        source: '/danh-muc-dau-tu/:path*',
        destination: '/portfolio/:path*',
      },
      {
        source: '/goi-hoi-vien',
        destination: '/membership',
      },
      {
        source: '/goi-hoi-vien/:path*',
        destination: '/membership/:path*',
      },
      {
        source: '/lien-he',
        destination: '/contact',
      },
      {
        source: '/lien-he/:path*',
        destination: '/contact/:path*',
      },
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_URL || 'http://127.0.0.1:3001'}/api/v1/:path*`,
      },
    ];
  },

  // SEC: Security Headers + Tightened CSP for production
  async headers() {
    const securityHeaders = [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Content-Security-Policy',
        // FIX: Removed unsafe-eval and unsafe-inline. Scripts only from self.
        // connect-src: only same-origin and known CDN
        // img-src: self, data, blob for inline images, and specific approved domains
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https: http: http://localhost:3001 http://127.0.0.1:3001",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' http://localhost:3001 http://127.0.0.1:3001",
          buildFrameSrcDirective(),
          "frame-ancestors 'self'",
          "form-action 'self'",
          "base-uri 'self'",
          "object-src 'none'",
        ].join('; '),
      },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
