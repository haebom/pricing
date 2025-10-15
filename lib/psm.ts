import { PSMRow } from './store';

export type PSMCurves = {
  price: number;
  tooCheapCum: number;
  cheapCum: number;
  expensiveCumDesc: number;
  tooExpensiveCumDesc: number;
}[];

export type PSMPoints = {
  opp?: number; // Optimal Price Point: Too Cheap cum == Too Expensive desc
  ipp?: number; // Indifference Price Point: Cheap cum == Expensive desc
  lowerBound?: number; // Too Cheap cum == Expensive desc
  upperBound?: number; // Cheap cum == Too Expensive desc
};

export function sortRows(rows: PSMRow[]) {
  return [...rows].sort((a, b) => a.price - b.price);
}

function cumulativeAscending(values: number[]) {
  const out: number[] = [];
  let s = 0;
  for (const v of values) {
    s += v;
    out.push(s);
  }
  // 정규화(최종값이 100이 아니더라도 0~100로 스케일)
  const max = s || 1;
  return out.map((x) => (x / max) * 100);
}

function cumulativeDescending(values: number[]) {
  const out: number[] = [];
  let s = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    s += values[i];
    out.push(s);
  }
  const max = s || 1;
  const descNormalized = out.map((x) => (x / max) * 100).reverse();
  return descNormalized;
}

export function makeCurves(rows: PSMRow[]): PSMCurves {
  const sorted = sortRows(rows);
  const tooCheapCum = cumulativeAscending(sorted.map((r) => r.tooCheap));
  const cheapCum = cumulativeAscending(sorted.map((r) => r.cheap));
  const expensiveCumDesc = cumulativeDescending(sorted.map((r) => r.expensive));
  const tooExpensiveCumDesc = cumulativeDescending(sorted.map((r) => r.tooExpensive));

  return sorted.map((r, i) => ({
    price: r.price,
    tooCheapCum: tooCheapCum[i],
    cheapCum: cheapCum[i],
    expensiveCumDesc: expensiveCumDesc[i],
    tooExpensiveCumDesc: tooExpensiveCumDesc[i],
  }));
}

function findIntersectionPrice(prices: number[], a: number[], b: number[]) {
  for (let i = 0; i < prices.length - 1; i++) {
    const p1 = prices[i], p2 = prices[i + 1];
    const a1 = a[i], a2 = a[i + 1];
    const b1 = b[i], b2 = b[i + 1];
    const d1 = a1 - b1;
    const d2 = a2 - b2;
    if (d1 === 0) return p1;
    if (d1 * d2 < 0) {
      const denom = (a2 - a1) - (b2 - b1);
      const t = denom === 0 ? 0 : (b1 - a1) / denom; // 0~1 범위
      const tClamped = Math.min(1, Math.max(0, t));
      return p1 + tClamped * (p2 - p1);
    }
  }
  return undefined;
}

export function computePSM(rows: PSMRow[]): { curves: PSMCurves; points: PSMPoints; recommended?: number } {
  const curves = makeCurves(rows);
  const prices = curves.map((c) => c.price);
  const opp = findIntersectionPrice(prices, curves.map((c) => c.tooCheapCum), curves.map((c) => c.tooExpensiveCumDesc));
  const ipp = findIntersectionPrice(prices, curves.map((c) => c.cheapCum), curves.map((c) => c.expensiveCumDesc));
  const lowerBound = findIntersectionPrice(prices, curves.map((c) => c.tooCheapCum), curves.map((c) => c.expensiveCumDesc));
  const upperBound = findIntersectionPrice(prices, curves.map((c) => c.cheapCum), curves.map((c) => c.tooExpensiveCumDesc));
  const points: PSMPoints = { opp, ipp, lowerBound, upperBound };

  const recommended = opp ?? ipp; // 기본은 OPP, 없으면 IPP
  return { curves, points, recommended };
}