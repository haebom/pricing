"use client";
import Link from 'next/link';
import { getExample } from '@/lib/examples';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function ExampleApplyClient({ id }: { id: string }) {
  const ex = getExample(id);
  const setPsmData = useStore((s) => s.setPsmData);
  const setGaborRows = useStore((s) => s.setGaborRows);
  const setGaborCost = useStore((s) => s.setGaborCost);
  const setConjoint = useStore((s) => s.setConjoint);

  useEffect(() => {
    if (!ex) return;
    setPsmData(ex.psm);
    setGaborRows(ex.gabor.rows);
    setGaborCost(ex.gabor.cost);
    setConjoint(ex.conjoint);
  }, [ex, setPsmData, setGaborRows, setGaborCost, setConjoint]);

  if (!ex) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">예시를 찾을 수 없습니다</h1>
        <Link href="/" className="text-brand-blue focus-ring">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">예시 적용됨: {ex.name}</h1>
      <p className="text-sm text-gray-700">{ex.description}</p>
      <div className="text-xs text-gray-500">방법: {ex.tags.join(', ')}</div>

      {ex.sourceUrl && (
        <div className="rounded border p-4 bg-gray-50">
          <div className="text-sm font-medium mb-1">공식 요금제 페이지</div>
          <a
            href={ex.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue text-sm underline focus-ring"
          >
            {ex.sourceUrl}
          </a>
        </div>
      )}

      <div className="grid-responsive">
        <Link href="/psm" className="block rounded border p-4 hover:border-brand-blue focus-ring">
          <div className="font-medium">Van Westendorp (PSM)</div>
          <div className="text-sm text-gray-600">교차점(세부: OPP/IPP/하한/상한) 확인</div>
        </Link>
        <Link href="/gabor" className="block rounded border p-4 hover:border-brand-blue focus-ring">
          <div className="font-medium">Gabor–Granger</div>
          <div className="text-sm text-gray-600">전환·수익·이익 곡선과 최적가 확인</div>
        </Link>
        <Link href="/conjoint" className="block rounded border p-4 hover:border-brand-blue focus-ring">
          <div className="font-medium">Conjoint</div>
          <div className="text-sm text-gray-600">점유율/WTP 근사 및 권장가 확인</div>
        </Link>
        <Link href="/integrated" className="block rounded border p-4 hover:border-brand-blue focus-ring">
          <div className="font-medium">통합</div>
          <div className="text-sm text-gray-600">가중 평균 권장가 확인</div>
        </Link>
      </div>
      <div className="text-sm text-gray-600">각 페이지로 이동하면 샘플 데이터가 자동 반영됩니다.</div>
    </div>
  );
}