import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { MealType } from '../data/types';

interface MealContextValue {
  selectedMeal: MealType | null;
  setSelectedMeal: (meal: MealType | null) => void;
  scanTimestamp: number | null;
  setScanTimestamp: (ts: number | null) => void;
}

const MealContext = createContext<MealContextValue | undefined>(undefined);

export function MealProvider({ children }: { children: ReactNode }) {
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [scanTimestamp, setScanTimestamp] = useState<number | null>(null);

  const value = useMemo(
    () => ({ selectedMeal, setSelectedMeal, scanTimestamp, setScanTimestamp }),
    [selectedMeal, scanTimestamp]
  );

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
}

export function useMeal() {
  const ctx = useContext(MealContext);
  if (!ctx) throw new Error('useMeal must be used within a MealProvider');
  return ctx;
}
