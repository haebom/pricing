import type { PSMRow, GaborRow, ConjointAttribute, ConjointPartworths, ConjointProfile } from './store';

export type ExampleData = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sourceUrl?: string;
  psm: PSMRow[];
  gabor: { rows: GaborRow[]; cost: number };
  conjoint: { attributes: ConjointAttribute[]; partworths: ConjointPartworths; betaPrice: number; profiles: ConjointProfile[] };
};

export const EXAMPLES: ExampleData[] = [
  {
    id: 'notion',
    name: 'Notion 개인 요금제',
    description: '생산성 SaaS 개인/팀 요금제 감각을 가정한 샘플',
    tags: ['PSM', 'Van Westendorp', 'G–G', 'Conjoint'],
    sourceUrl: 'https://www.notion.com/ko/pricing',
    psm: [
      { price: 5, tooCheap: 30, cheap: 50, expensive: 15, tooExpensive: 5 },
      { price: 10, tooCheap: 15, cheap: 45, expensive: 30, tooExpensive: 10 },
      { price: 15, tooCheap: 8, cheap: 35, expensive: 40, tooExpensive: 17 },
      { price: 20, tooCheap: 5, cheap: 25, expensive: 45, tooExpensive: 25 },
      { price: 30, tooCheap: 2, cheap: 10, expensive: 50, tooExpensive: 38 },
    ],
    gabor: {
      cost: 4,
      rows: [
        { price: 5, conversionRate: 40 },
        { price: 10, conversionRate: 32 },
        { price: 15, conversionRate: 25 },
        { price: 20, conversionRate: 18 },
        { price: 30, conversionRate: 10 },
      ],
    },
    conjoint: {
      attributes: [
        { name: 'Storage', levels: ['5GB', '50GB', '200GB'] },
        { name: 'Support', levels: ['Community', 'Email', 'Priority'] },
      ],
      partworths: {
        Storage: { '5GB': 0, '50GB': 0.3, '200GB': 0.6 },
        Support: { Community: 0, Email: 0.2, Priority: 0.5 },
      },
      betaPrice: -0.02,
      profiles: [
        { name: 'A', selections: { Storage: '50GB', Support: 'Email' } },
        { name: 'B', selections: { Storage: '200GB', Support: 'Priority' } },
      ],
    },
  },
  {
    id: 'figma',
    name: 'Figma 요금제',
    description: '디자인 협업 SaaS 요금제 샘플',
    tags: ['PSM', 'Van Westendorp', 'G–G', 'Conjoint'],
    sourceUrl: 'https://www.figma.com/ko-kr/pricing/',
    psm: [
      { price: 20, tooCheap: 25, cheap: 50, expensive: 18, tooExpensive: 7 },
      { price: 30, tooCheap: 15, cheap: 45, expensive: 28, tooExpensive: 12 },
      { price: 50, tooCheap: 7, cheap: 30, expensive: 40, tooExpensive: 23 },
      { price: 70, tooCheap: 3, cheap: 20, expensive: 45, tooExpensive: 32 },
      { price: 80, tooCheap: 2, cheap: 12, expensive: 50, tooExpensive: 36 },
    ],
    gabor: {
      cost: 15,
      rows: [
        { price: 20, conversionRate: 35 },
        { price: 30, conversionRate: 30 },
        { price: 50, conversionRate: 22 },
        { price: 70, conversionRate: 15 },
        { price: 80, conversionRate: 12 },
      ],
    },
    conjoint: {
      attributes: [
        { name: 'Seats', levels: ['1', '5', '10'] },
        { name: 'Projects', levels: ['5', '50', '200'] },
      ],
      partworths: {
        Seats: { '1': 0, '5': 0.3, '10': 0.6 },
        Projects: { '5': 0, '50': 0.25, '200': 0.55 },
      },
      betaPrice: -0.015,
      profiles: [
        { name: 'A', selections: { Seats: '5', Projects: '50' } },
        { name: 'B', selections: { Seats: '10', Projects: '200' } },
      ],
    },
  },
  {
    id: 'datadog',
    name: 'Datadog 가격',
    description: '옵저버빌리티/모니터링 SaaS 샘플',
    tags: ['PSM', 'Van Westendorp', 'G–G', 'Conjoint'],
    sourceUrl: 'https://www.datadoghq.com/ko/pricing/',
    psm: [
      { price: 5, tooCheap: 28, cheap: 52, expensive: 15, tooExpensive: 5 },
      { price: 10, tooCheap: 18, cheap: 45, expensive: 28, tooExpensive: 9 },
      { price: 15, tooCheap: 10, cheap: 35, expensive: 37, tooExpensive: 18 },
      { price: 20, tooCheap: 6, cheap: 25, expensive: 45, tooExpensive: 24 },
      { price: 30, tooCheap: 3, cheap: 12, expensive: 52, tooExpensive: 33 },
    ],
    gabor: {
      cost: 6,
      rows: [
        { price: 5, conversionRate: 42 },
        { price: 10, conversionRate: 34 },
        { price: 15, conversionRate: 27 },
        { price: 20, conversionRate: 20 },
        { price: 30, conversionRate: 12 },
      ],
    },
    conjoint: {
      attributes: [
        { name: 'Hosts', levels: ['10', '50', '200'] },
        { name: 'Retention', levels: ['7d', '30d', '90d'] },
      ],
      partworths: {
        Hosts: { '10': 0, '50': 0.3, '200': 0.6 },
        Retention: { '7d': 0, '30d': 0.25, '90d': 0.55 },
      },
      betaPrice: -0.02,
      profiles: [
        { name: 'A', selections: { Hosts: '50', Retention: '30d' } },
        { name: 'B', selections: { Hosts: '200', Retention: '90d' } },
      ],
    },
  },
];

export function getExample(id: string): ExampleData | undefined {
  return EXAMPLES.find((e) => e.id === id);
}