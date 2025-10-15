"use client";
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function HomePage() {
  const methods = [
    { href: '/psm', title: 'Van Westendorp (PSM)', desc: '가격 인식 4문항 기반 CDF/CCDF 교차점' },
    { href: '/gabor', title: 'Gabor–Granger', desc: '가격 포인트별 전환율 기반 수익/이익 최적화' },
    { href: '/conjoint', title: 'Conjoint', desc: '속성·레벨·효용 Part-worth 편집과 점유율/WTP' },
    { href: '/integrated', title: '통합', desc: '각 분석 권장가를 가중 평균으로 통합' },
  ];

  return (
    <div className="grid-responsive">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">방법 선택</h2>
        <div className="grid grid-cols-1 gap-3">
          {methods.map((m) => (
            <Link key={m.href} href={m.href} className="block rounded-lg border border-gray-200 p-4 hover:border-brand-blue focus-ring">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold">{m.title}</div>
                  <div className="text-sm text-gray-600">{m.desc}</div>
                </div>
                <span className="text-brand-blue">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">예시 시나리오</h2>
        <div className="grid grid-cols-1 gap-3">
          <Link href="/examples/notion" className="block rounded-lg border border-gray-200 p-4 hover:border-brand-blue focus-ring">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold">Notion 개인 요금제</div>
                <div className="text-xs text-gray-600">PSM/VW · G–G · Conjoint</div>
              </div>
              <span className="text-brand-blue">적용하기 →</span>
            </div>
          </Link>
          <Link href="/examples/figma" className="block rounded-lg border border-gray-200 p-4 hover:border-brand-blue focus-ring">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold">Figma 요금제</div>
                <div className="text-xs text-gray-600">PSM/VW · G–G · Conjoint</div>
              </div>
              <span className="text-brand-blue">적용하기 →</span>
            </div>
          </Link>
          <Link href="/examples/datadog" className="block rounded-lg border border-gray-200 p-4 hover:border-brand-blue focus-ring">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold">Datadog 가격</div>
                <div className="text-xs text-gray-600">PSM/VW · G–G · Conjoint</div>
              </div>
              <span className="text-brand-blue">적용하기 →</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}