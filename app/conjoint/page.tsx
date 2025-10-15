"use client";
import { useEffect, useMemo, useState } from 'react';
import { useStore, type ConjointAttribute, type ConjointPartworths, type ConjointProfile } from '@/lib/store';
import { sharesMNL, wtpApprox, recommendedPriceFromConjoint } from '@/lib/conjoint';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

export default function ConjointPage() {
  const { attributes: savedAttrs, partworths: savedPw, betaPrice: savedBeta, profiles: savedProfiles } = useStore((s) => s.conjointData);
  const setConjoint = useStore((s) => s.setConjoint);
  const addRecent = useStore((s) => s.addRecent);

  const [attributes, setAttributes] = useState<ConjointAttribute[]>(savedAttrs.length ? savedAttrs : [{ name: 'Price', levels: ['Low', 'High'] }]);
  const [partworths, setPartworths] = useState<ConjointPartworths>(Object.keys(savedPw).length ? savedPw : { Price: { Low: 0, High: -1 } });
  const [betaPrice, setBetaPrice] = useState<number>(savedBeta ?? -0.01);
  const [profiles, setProfiles] = useState<ConjointProfile[]>(savedProfiles.length ? savedProfiles : [{ name: 'A', selections: { Price: 'Low' } }, { name: 'B', selections: { Price: 'High' } }]);

  // 자동 저장
  useEffect(() => setConjoint({ attributes, partworths, betaPrice, profiles }), [attributes, partworths, betaPrice, profiles, setConjoint]);

  const shares = useMemo(() => sharesMNL(profiles, partworths, 1), [profiles, partworths]);
  const chartData = profiles.map((p, i) => ({ name: p.name, share: Math.round(shares[i] * 1000) / 10 }));
  const recommended = useMemo(() => recommendedPriceFromConjoint(partworths, betaPrice), [partworths, betaPrice]);

  const saveSnapshot = () => {
    addRecent({ id: `conjoint-${Date.now()}`, type: 'conjoint', title: 'Conjoint 스냅샷', summary: `추천 WTP≈${recommended ? Math.round(recommended) : '-'}` , timestamp: Date.now() });
  };

  function addAttribute() {
    const name = `Attr${attributes.length + 1}`;
    const nextAttr: ConjointAttribute = { name, levels: ['L1', 'L2'] };
    setAttributes((prev) => [...prev, nextAttr]);
    setPartworths((prev) => ({ ...prev, [name]: { L1: 0, L2: 0 } }));
  }

  function addLevel(attr: string) {
    setAttributes((prev) => prev.map((a) => a.name === attr ? { ...a, levels: [...a.levels, `L${a.levels.length + 1}`] } : a));
    setPartworths((prev) => ({ ...prev, [attr]: { ...prev[attr], [`L${(prev[attr] ? Object.keys(prev[attr]).length : 0) + 1}`]: 0 } }));
  }

  function setPw(attr: string, lvl: string, val: number) {
    setPartworths((prev) => ({ ...prev, [attr]: { ...prev[attr], [lvl]: val } }));
  }

  function addProfile() {
    const name = `P${profiles.length + 1}`;
    const selections: Record<string, string> = {};
    attributes.forEach((a) => { selections[a.name] = a.levels[0]; });
    setProfiles((prev) => [...prev, { name, selections }]);
  }

  function setSelection(pIdx: number, attr: string, lvl: string) {
    setProfiles((prev) => prev.map((p, i) => i === pIdx ? { ...p, selections: { ...p.selections, [attr]: lvl } } : p));
  }

  const wtpTable = useMemo(() => {
    const out: { attr: string; level: string; wtp: number }[] = [];
    attributes.forEach((a) => {
      if (!partworths[a.name]) return;
      const baseline = a.levels[0];
      wtpApprox(partworths, a.name, baseline, betaPrice).forEach((w) => out.push({ attr: a.name, level: w.level, wtp: w.wtp }));
    });
    return out;
  }, [attributes, partworths, betaPrice]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold mb-2">Conjoint 설정</h1>
        <p className="text-sm text-gray-600 mb-4">속성과 레벨, 각 레벨의 Part-worth(효용)를 입력하세요. 베타 가격(betaPrice)은 화폐단위당 효용(보통 음수)입니다.</p>

        <div className="space-y-4">
          {attributes.map((a) => (
            <div key={a.name} className="rounded border p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">{a.name}</div>
                <button className="text-brand-blue focus-ring" onClick={() => addLevel(a.name)}>레벨 추가</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">레벨</th>
                      <th className="p-2">Part-worth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.levels.map((lvl) => (
                      <tr key={lvl} className="border-b">
                        <td className="p-2">{lvl}</td>
                        <td className="p-2"><input aria-label={`${a.name}-${lvl}`} type="number" className="w-24 border rounded p-1 focus-ring" value={partworths[a.name]?.[lvl] ?? 0} onChange={(e) => setPw(a.name, lvl, Number(e.target.value))} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <button className="rounded bg-brand-blue text-white px-3 py-2 focus-ring" onClick={addAttribute}>속성 추가</button>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">betaPrice(효용/화폐단위):</label>
          <input aria-label="betaPrice" type="number" className="w-28 border rounded p-1 focus-ring" value={betaPrice} onChange={(e) => setBetaPrice(Number(e.target.value))} />
          <button className="rounded border border-gray-300 px-3 py-2 focus-ring" onClick={saveSnapshot}>스냅샷 저장</button>
        </div>

        <h2 className="text-lg font-semibold mt-4 mb-2">프로필 및 점유율</h2>
        <div className="space-y-3">
          {profiles.map((p, idx) => (
            <div key={p.name} className="rounded border p-3">
              <div className="font-medium mb-2">프로필 {p.name}</div>
              <div className="grid md:grid-cols-2 gap-2">
                {attributes.map((a) => (
                  <label key={a.name} className="text-sm">
                    <span className="mr-2">{a.name}</span>
                    <select className="border rounded p-1 focus-ring" value={p.selections[a.name] ?? a.levels[0]} onChange={(e) => setSelection(idx, a.name, e.target.value)}>
                      {a.levels.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="rounded bg-brand-blue text-white px-3 py-2 focus-ring" onClick={addProfile}>프로필 추가</button>
        </div>

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend />
              <Bar dataKey="share" name="점유율(%)" fill="#2563EB">
                <LabelList dataKey="share" position="top" formatter={(v: number) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">WTP 근사</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">속성</th>
                <th className="p-2">레벨</th>
                <th className="p-2">WTP(통화)</th>
              </tr>
            </thead>
            <tbody>
              {wtpTable.map((w, i) => (
                <tr key={`${w.attr}-${w.level}-${i}`} className="border-b">
                  <td className="p-2">{w.attr}</td>
                  <td className="p-2">{w.level}</td>
                  <td className="p-2">{Number.isFinite(w.wtp) ? Math.round(w.wtp) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm">Conjoint 기준 권장가(근사): <span className="font-semibold">{recommended ? Math.round(recommended) : '-'}</span></div>
      </section>
    </div>
  );
}