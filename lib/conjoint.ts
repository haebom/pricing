import type { ConjointAttribute, ConjointPartworths, ConjointProfile } from './store';

export function utilityOfProfile(profile: ConjointProfile, partworths: ConjointPartworths): number {
  let u = 0;
  for (const [attr, level] of Object.entries(profile.selections)) {
    const pw = partworths[attr]?.[level] ?? 0;
    u += pw;
  }
  return u;
}

export function sharesMNL(profiles: ConjointProfile[], partworths: ConjointPartworths, scale = 1) {
  const utils = profiles.map((p) => utilityOfProfile(p, partworths) * scale);
  const exps = utils.map((u) => Math.exp(u));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / sum);
}

export function wtpApprox(partworths: ConjointPartworths, attribute: string, baselineLevel: string, betaPrice: number): { level: string; wtp: number }[] {
  // WTP(level) = (U(level) - U(baseline)) / -betaPrice
  const pwAttr = partworths[attribute] || {};
  const uBase = pwAttr[baselineLevel] ?? 0;
  const denom = betaPrice === 0 ? 1 : -betaPrice; // 보통 betaPrice < 0
  return Object.keys(pwAttr).map((lvl) => ({ level: lvl, wtp: (pwAttr[lvl] - uBase) / denom }));
}

export function recommendedPriceFromConjoint(partworths: ConjointPartworths, betaPrice: number): number | undefined {
  // 단순 근사: 모든 속성의 평균 WTP(베이스 대비) 중 양의 값 평균
  if (!betaPrice) return undefined;
  const attrs = Object.keys(partworths);
  const wtps: number[] = [];
  for (const attr of attrs) {
    const levels = Object.keys(partworths[attr] || {});
    if (levels.length < 2) continue;
    const base = levels[0];
    const uBase = partworths[attr][base] ?? 0;
    for (const lvl of levels.slice(1)) {
      const wtp = (partworths[attr][lvl] - uBase) / (betaPrice === 0 ? 1 : -betaPrice);
      if (wtp > 0) wtps.push(wtp);
    }
  }
  if (!wtps.length) return undefined;
  const avg = wtps.reduce((a, b) => a + b, 0) / wtps.length;
  return avg;
}