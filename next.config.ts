import type { NextConfig } from 'next';

// GitHub Pages의 커스텀 도메인(루트 제공)에서는 basePath가 비어 있어야 합니다.
// 필요 시에만 NEXT_PUBLIC_BASE_PATH를 지정해 사용합니다.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;