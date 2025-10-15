"use client";
import { useEffect, useMemo, useState } from 'react';
import { useStore, type GaborRow } from '@/lib/store';
import { computeGabor } from '@/lib/gabor';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';

function emptyRow(): GaborRow { return { price: 0, conversionRate: 0 }; }

export default function GaborPage() {
  const { rows: savedRows, cost: savedCost } = useStore((s) => s.gaborData);
  const setRows = useStore((s) => s.setGaborRows);
  const setCost = useStore((s) => s.setGaborCost);
  const addRecent = useStore((s) => s.addRecent);

  const [rows, setLocalRows] = useState<GaborRow[]>(savedRows.length ? savedRows : [emptyRow(), emptyRow(), emptyRow(), emptyRow()]);
  const [cost, setLocalCost] = useState<number>(savedCost ?? 0);

  useEffect(() => { setRows(rows); }, [rows, setRows]);
  useEffect(() => { setCost(cost); }, [cost, setCost]);

  const { series, recommended } = useMemo(() => computeGabor(rows.filter((r) => r.price > 0), cost), [rows, cost]);

  const saveSnapshot = () => {
    addRecent({ id: `gabor-${Date.now()}`, type: 'gabor', title: 'Gabor–Granger 스냅샷', summary: `최적가=${recommended ? Math.round(recommended) : '-'}, 원가=${cost}` , timestamp: Date.now() });
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold mb-2">Gabor–Granger 입력</h1>
        <p className="text-sm text-gray-600 mb-4">가격 포인트와 전환율(%)을 입력하고, 선택적으로 원가를 입력하면 이익 기준 최적가를 계산합니다.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">가격</th>
                <th className="p-2">전환율(%)</th>
                <th className="p-2">삭제</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2"><input aria-label="가격" type="number" className="w-24 border rounded p-1 focus-ring" value={r.price} onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalRows((prev) => prev.map((it, i) => (i === idx ? { ...it, price: v } : it)));
                  }} /></td>
                  <td className="p-2"><input aria-label="전환율" type="number" className="w-24 border rounded p-1 focus-ring" value={r.conversionRate} onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalRows((prev) => prev.map((it, i) => (i === idx ? { ...it, conversionRate: v } : it)));
                  }} /></td>
                  <td className="p-2"><button className="text-red-600 hover:underline focus-ring" onClick={() => setLocalRows((prev) => prev.filter((_, i) => i !== idx))}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-2 items-center">
          <button className="rounded bg-brand-blue text-white px-3 py-2 focus-ring" onClick={() => setLocalRows((prev) => [...prev, emptyRow()])}>행 추가</button>
          <label className="text-sm text-gray-700">원가(선택): </label>
          <input aria-label="원가" type="number" className="w-24 border rounded p-1 focus-ring" value={cost} onChange={(e) => setLocalCost(Number(e.target.value))} />
          <button className="rounded border border-gray-300 px-3 py-2 focus-ring" onClick={saveSnapshot}>스냅샷 저장</button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">결과 그래프 및 요약</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <XAxis dataKey="price" label={{ value: '가격', position: 'insideBottomRight', offset: -5 }} />
              <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, 1]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(v: number, name) => name === 'conversion' ? `${(v*100).toFixed(1)}%` : v.toFixed(2)} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="conversion" name="전환" stroke="#2563EB" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="수익" stroke="#10B981" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="profit" name="이익" stroke="#EF4444" dot={false} />
              {recommended && <ReferenceLine yAxisId="right" x={recommended} stroke="#F59E0B" label="최적가" />}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded border p-3">최적 권장가: <span className="font-semibold">{recommended ? Math.round(recommended) : '-'}</span></div>
          <div className="rounded border p-3">원가: {cost}</div>
        </div>
      </section>
    </div>
  );
}