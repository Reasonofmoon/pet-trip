// ===== Zustand Store — PetTrip Planner =====
import { create } from 'zustand';
import { WizardState, TripPlan, PetSize, PetTemperament } from '@/types';

interface AppStore {
  // Wizard
  wizard: WizardState;
  setWizardStep: (step: number) => void;
  setDestination: (areaCode: string, areaName: string, sigunguCode?: string, sigunguName?: string) => void;
  setDates: (startDate: string, endDate: string) => void;
  setPet: (size: PetSize, breed: string, temperament: PetTemperament) => void;
  setPreferences: (categories: string[], pace: 'relaxed' | 'moderate' | 'active', budgetLevel: 'low' | 'medium' | 'high') => void;
  resetWizard: () => void;

  // Generated course
  currentTrip: TripPlan | null;
  setCurrentTrip: (trip: TripPlan | null) => void;

  // UI
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

const initialWizard: WizardState = {
  step: 1,
  destination: { areaCode: '', areaName: '' },
  dates: { startDate: '', endDate: '' },
  pet: { size: 'medium', breed: '', temperament: 'calm' },
  preferences: { categories: [], pace: 'relaxed', budgetLevel: 'medium' },
};

export const useAppStore = create<AppStore>((set) => ({
  wizard: { ...initialWizard },
  setWizardStep: (step) => set((s) => ({ wizard: { ...s.wizard, step } })),
  setDestination: (areaCode, areaName, sigunguCode, sigunguName) =>
    set((s) => ({ wizard: { ...s.wizard, destination: { areaCode, areaName, sigunguCode, sigunguName } } })),
  setDates: (startDate, endDate) =>
    set((s) => ({ wizard: { ...s.wizard, dates: { startDate, endDate } } })),
  setPet: (size, breed, temperament) =>
    set((s) => ({ wizard: { ...s.wizard, pet: { size, breed, temperament } } })),
  setPreferences: (categories, pace, budgetLevel) =>
    set((s) => ({ wizard: { ...s.wizard, preferences: { categories, pace, budgetLevel } } })),
  resetWizard: () => set({ wizard: { ...initialWizard } }),

  currentTrip: null,
  setCurrentTrip: (trip) => set({ currentTrip: trip }),

  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  selectedDay: 1,
  setSelectedDay: (day) => set({ selectedDay: day }),
}));
