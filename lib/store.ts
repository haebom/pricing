"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LS_KEYS } from './storage';

export type RecentScenario = {
  id: string;
  type: 'psm' | 'gabor' | 'conjoint' | 'integrated';
  title: string;
  summary: string;
  timestamp: number;
};

export type PSMRow = { price: number; tooCheap: number; cheap: number; expensive: number; tooExpensive: number };
export type GaborRow = { price: number; conversionRate: number };

export type ConjointAttribute = { name: string; levels: string[] };
export type ConjointPartworths = Record<string, Record<string, number>>; // attribute -> level -> utility
export type ConjointProfile = { name: string; selections: Record<string, string> }; // attribute -> level

type StoreState = {
  recent: RecentScenario[];
  addRecent: (item: RecentScenario) => void;

  psmData: PSMRow[];
  setPsmData: (rows: PSMRow[]) => void;

  gaborData: { rows: GaborRow[]; cost: number };
  setGaborRows: (rows: GaborRow[]) => void;
  setGaborCost: (cost: number) => void;

  conjointData: {
    attributes: ConjointAttribute[];
    partworths: ConjointPartworths;
    betaPrice: number; // utils per currency unit (negative typical)
    profiles: ConjointProfile[];
  };
  setConjoint: (data: Partial<StoreState['conjointData']>) => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      recent: [],
      addRecent: (item) =>
        set((state) => {
          const next = [item, ...state.recent].slice(0, 5);
          return { recent: next };
        }),

      psmData: [],
      setPsmData: (rows) => set({ psmData: rows }),

      gaborData: { rows: [], cost: 0 },
      setGaborRows: (rows) => set((s) => ({ gaborData: { ...s.gaborData, rows } })),
      setGaborCost: (cost) => set((s) => ({ gaborData: { ...s.gaborData, cost } })),

      conjointData: { attributes: [], partworths: {}, betaPrice: -0.01, profiles: [] },
      setConjoint: (data) => set((s) => ({ conjointData: { ...s.conjointData, ...data } })),
    }),
    {
      name: LS_KEYS.integrated, // 모든 슬라이스를 하나의 키에 저장
      version: 1,
      partialize: (state) => ({
        recent: state.recent,
        psmData: state.psmData,
        gaborData: state.gaborData,
        conjointData: state.conjointData,
      }),
    }
  )
);