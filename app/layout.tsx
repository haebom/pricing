import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Pricing Lab — PSM · Gabor–Granger · Conjoint',
  description: '정적 웹앱에서 가격연구 3종의 입력·시각화·시나리오·권장가 산출을 제공',
  robots: { index: process.env.NEXT_PUBLIC_INDEX === 'true' },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Pricing Lab',
    description: '가격 연구 시뮬레이터',
    url: 'https://example.com',
    siteName: 'Pricing Lab',
    locale: 'ko_KR',
    type: 'website',
    images: ['/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Lab — PSM · Gabor–Granger · Conjoint',
    description: '정적 웹앱에서 가격연구 3종의 입력·시각화·시나리오·권장가 산출을 제공',
    images: ['/twitter-image.png'],
  },
  metadataBase: new URL('https://example.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b border-gray-200">
          <div className="container py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              <span className="text-brand-blue">Pricing</span> Lab
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/psm" className="hover:text-brand-blue focus-ring">Van Westendorp</Link>
              <Link href="/gabor" className="hover:text-brand-blue focus-ring">G–G</Link>
              <Link href="/conjoint" className="hover:text-brand-blue focus-ring">Conjoint</Link>
              <Link href="/integrated" className="hover:text-brand-blue focus-ring">통합</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="container py-8 text-sm text-gray-600">
          <div className="flex items-center gap-3 mb-3">
            <Image src="/logo.png" alt="Oswarld logo" width={28} height={28} />
            <span className="font-medium">Oswarld&apos;s World</span>
          </div>
          <div className="space-y-1">
            <p>사업자 등록번호 | 735-23-01161</p>
            <p>통신판매업신고 | 2025-성남분당A-0704</p>
            <p>Copyright 2025 ©Oswarld. All rights reserved.</p>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a href="https://t.me/oswarld_oz" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue underline">Telegram</a>
              <a href="https://www.linkedin.com/in/oswarld" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue underline">LinkedIn</a>
              <a href="https://www.instagram.com/oswarld.the.lucky.rabbit" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue underline">Instagram</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}