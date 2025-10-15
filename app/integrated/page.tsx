"use client";
import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { computePSM } from '@/lib/psm';
import { computeGabor } from '@/lib/gabor';
import { recommendedPriceFromConjoint } from '@/lib/conjoint';

export default function IntegratedPage() {
  const psmRows = useStore((s) => s.psmData);
  const { rows: gaborRows, cost } = useStore((s) => s.gaborData);
  const { partworths, betaPrice } = useStore((s) => s.conjointData);
  const addRecent = useStore((s) => s.addRecent);

  const psmRecommended = useMemo(() => computePSM(psmRows.filter((r) => r.price > 0)).recommended, [psmRows]);
  const gaborRecommended = useMemo(() => computeGabor(gaborRows.filter((r) => r.price > 0), cost).recommended, [gaborRows, cost]);
  const conjointRecommended = useMemo(() => recommendedPriceFromConjoint(partworths, betaPrice), [partworths, betaPrice]);

  const [weights, setWeights] = useState({ psm: 1, gabor: 1, conjoint: 1 });

  const weighted = useMemo(() => {
    const items = [
      { v: psmRecommended, w: weights.psm },
      { v: gaborRecommended, w: weights.gabor },
      { v: conjointRecommended, w: weights.conjoint },
    ].filter((i) => typeof i.v === 'number' && i.w > 0) as { v: number; w: number }[];
    const sumW = items.reduce((a, b) => a + b.w, 0);
    if (!sumW || !items.length) return undefined;
    const val = items.reduce((a, b) => a + b.v * b.w, 0) / sumW;
    return val;
  }, [psmRecommended, gaborRecommended, conjointRecommended, weights]);

  const saveSnapshot = () => {
    addRecent({ id: `integrated-${Date.now()}`, type: 'integrated', title: '통합 스냅샷', summary: `wPSM=${weights.psm}, wGG=${weights.gabor}, wCJ=${weights.conjoint}, 권장가=${weighted ? Math.round(weighted) : '-'}` , timestamp: Date.now() });
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold mb-2">통합 권장가</h1>
        <p className="text-sm text-gray-600 mb-4">각 분석의 권장가를 불러와 가중 평균을 계산합니다.</p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded border p-3">
            <div className="font-medium mb-2">PSM</div>
            <div>권장가: {psmRecommended ? Math.round(psmRecommended) : '-'}</div>
            <label className="mt-2 block">가중치: <input type="range" min={0} max={3} step={1} value={weights.psm} onChange={(e) => setWeights((w) => ({ ...w, psm: Number(e.target.value) }))} /></label>
          </div>
          <div className="rounded border p-3">
            <div className="font-medium mb-2">Gabor–Granger</div>
            <div>권장가: {gaborRecommended ? Math.round(gaborRecommended) : '-'}</div>
            <label className="mt-2 block">가중치: <input type="range" min={0} max={3} step={1} value={weights.gabor} onChange={(e) => setWeights((w) => ({ ...w, gabor: Number(e.target.value) }))} /></label>
          </div>
          <div className="rounded border p-3">
            <div className="font-medium mb-2">Conjoint</div>
            <div>권장가(근사): {conjointRecommended ? Math.round(conjointRecommended) : '-'}</div>
            <label className="mt-2 block">가중치: <input type="range" min={0} max={3} step={1} value={weights.conjoint} onChange={(e) => setWeights((w) => ({ ...w, conjoint: Number(e.target.value) }))} /></label>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <div>가중 평균 권장가: <span className="font-semibold">{weighted ? Math.round(weighted) : '-'}</span></div>
          <button className="rounded border border-gray-300 px-3 py-2 focus-ring" onClick={saveSnapshot}>스냅샷 저장</button>
        </div>
      </section>
    </div>
  );
}