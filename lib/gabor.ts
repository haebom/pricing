import { GaborRow } from './store';

export type GaborComputed = {
  price: number;
  conversion: number; // 0~1
  revenue: number;
  profit: number;
}[];

export function computeGabor(rows: GaborRow[], cost: number): { series: GaborComputed; recommended?: number } {
  const sorted = [...rows].sort((a, b) => a.price - b.price);
  const series: GaborComputed = sorted.map((r) => {
    const conv = Math.max(0, Math.min(1, r.conversionRate / 100));
    const revenue = r.price * conv;
    const profit = (r.price - cost) * conv;
    return { price: r.price, conversion: conv, revenue, profit };
  });
  const best = series.reduce((acc, cur) => (cur.profit > acc.profit ? cur : acc), series[0] ?? { price: 0, conversion: 0, revenue: 0, profit: -Infinity });
  const recommended = series.length ? best.price : undefined;
  return { series, recommended };
}