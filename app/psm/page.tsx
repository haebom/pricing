"use client";
import { useEffect, useMemo, useState } from 'react';
import { useStore, type PSMRow } from '@/lib/store';
import { computePSM } from '@/lib/psm';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';

function emptyRow(): PSMRow {
  return { price: 0, tooCheap: 0, cheap: 0, expensive: 0, tooExpensive: 0 };
}

export default function PSMPage() {
  const rows = useStore((s) => s.psmData);
  const setRows = useStore((s) => s.setPsmData);
  const addRecent = useStore((s) => s.addRecent);
  const [localRows, setLocalRows] = useState<PSMRow[]>(rows.length ? rows : [emptyRow(), emptyRow(), emptyRow(), emptyRow()]);

  useEffect(() => setRows(localRows), [localRows, setRows]); // 자동 저장

  const { curves, points, recommended } = useMemo(() => computePSM(localRows.filter((r) => r.price > 0)), [localRows]);

  const saveSnapshot = () => {
    addRecent({
      id: `psm-${Date.now()}`,
      type: 'psm',
      title: 'PSM 스냅샷',
      summary: `OPP=${points.opp?.toFixed(0) ?? '-'}, IPP=${points.ipp?.toFixed(0) ?? '-'}`,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold mb-2">Van Westendorp (PSM) 입력</h1>
        <p className="text-sm text-gray-600 mb-4">각 가격 포인트에 대해 Too Cheap, Cheap, Expensive, Too Expensive(%)를 입력하세요. 입력값은 자동 저장됩니다.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">가격</th>
                <th className="p-2">Too Cheap(%)</th>
                <th className="p-2">Cheap(%)</th>
                <th className="p-2">Expensive(%)</th>
                <th className="p-2">Too Expensive(%)</th>
                <th className="p-2">삭제</th>
              </tr>
            </thead>
            <tbody>
              {localRows.map((r, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2"><input aria-label="가격" type="number" className="w-24 border rounded p-1 focus-ring" value={r.price} onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalRows((prev) => prev.map((it, i) => (i === idx ? { ...it, price: v } : it)));
                  }} /></td>
                  <td className="p-2"><input aria-label="Too Cheap" type="number" className="w-20 border rounded p-1 focus-ring" value={r.tooCheap} onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalRows((prev) => prev.map((it, i) => (i === idx ? { ...it, tooCheap: v } : it)));
                  }} /></td>
                  <td className="p-2"><input aria-label="Cheap" type="number" className="w-20 border rounded p-1 focus-ring" value={r.cheap} onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalRows((prev) => prev.map((it, i) => (i === idx ? { ...it, cheap: v } : it)));
                  }} /></td>
                  <td className="p-2"><input aria-label="Expensive" type="number" className="w-20 border rounded p-1 focus-ring" value={r.expensive} onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalRows((prev) => prev.map((it, i) => (i === idx ? { ...it, expensive: v } : it)));
                  }} /></td>
                  <td className="p-2"><input aria-label="Too Expensive" type="number" className="w-20 border rounded p-1 focus-ring" value={r.tooExpensive} onChange={(e) => {
                    const v = Number(e.target.value);
                    setLocalRows((prev) => prev.map((it, i) => (i === idx ? { ...it, tooExpensive: v } : it)));
                  }} /></td>
                  <td className="p-2">
                    <button className="text-red-600 hover:underline focus-ring" onClick={() => setLocalRows((prev) => prev.filter((_, i) => i !== idx))}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded bg-brand-blue text-white px-3 py-2 focus-ring" onClick={() => setLocalRows((prev) => [...prev, emptyRow()])}>행 추가</button>
          <button className="rounded border border-gray-300 px-3 py-2 focus-ring" onClick={saveSnapshot}>스냅샷 저장</button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">결과 그래프 및 요약 (Van Westendorp)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={curves} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <XAxis dataKey="price" tickFormatter={(v) => String(v)} label={{ value: '가격', position: 'insideBottomRight', offset: -5 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
              <Legend />
              <Line type="monotone" dataKey="tooCheapCum" name="Too Cheap(CDF)" stroke="#9CA3AF" dot={false} />
              <Line type="monotone" dataKey="cheapCum" name="Cheap(CDF)" stroke="#2563EB" dot={false} />
              <Line type="monotone" dataKey="expensiveCumDesc" name="Expensive(CCDF)" stroke="#EF4444" dot={false} />
              <Line type="monotone" dataKey="tooExpensiveCumDesc" name="Too Expensive(CCDF)" stroke="#7C3AED" dot={false} />
              {points.opp && <ReferenceLine x={points.opp} stroke="#10B981" label="OPP" />}
              {points.ipp && <ReferenceLine x={points.ipp} stroke="#F59E0B" label="IPP" />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded border p-3">
            <div>권장가(OPP): <span className="font-semibold">{recommended ? Math.round(recommended) : '-'}</span></div>
            <div>IPP(무차별점): {points.ipp ? Math.round(points.ipp) : '-'}</div>
          </div>
          <div className="rounded border p-3">
            <div>허용 하한: {points.lowerBound ? Math.round(points.lowerBound) : '-'}</div>
            <div>허용 상한: {points.upperBound ? Math.round(points.upperBound) : '-'}</div>
          </div>
        </div>
      </section>
    </div>
  );
}