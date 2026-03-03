// ===== Zustand Store — PetTrip Planner =====
import { create } from 'zustand';
import { WizardState, TripPlan, PetSize, PetTemperament } from '@/types';

const initialWizard: WizardState = {
  step: 1,
  destination: { areaCode: '', areaName: '' },
  dates: { startDate: '', endDate: '' },
  pet: { size: 'medium', breed: '', temperament: 'calm' },
  preferences: { categories: [], pace: 'moderate', budgetLevel: 'medium' },
};

interface AppStore {
  // Wizard
  wizard: WizardState;
  setWizardStep: (step: number) => void;
  setDestination: (areaCode: string, areaName: string) => void;
  setDates: (start: string, end: string) => void;
  setPet: (size: PetSize, breed: string, temperament: PetTemperament) => void;
  setPreferences: (categories: string[], pace: 'relaxed' | 'moderate' | 'active', budgetLevel: 'low' | 'medium' | 'high') => void;
  resetWizard: () => void;
  // Trip
  currentTrip: TripPlan | null;
  setCurrentTrip: (trip: TripPlan) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  // Generation
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  // BYOK Settings
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Wizard
  wizard: { ...initialWizard },
  setWizardStep: (step) => set((s) => ({ wizard: { ...s.wizard, step } })),
  setDestination: (areaCode, areaName) => set((s) => ({ wizard: { ...s.wizard, destination: { areaCode, areaName } } })),
  setDates: (startDate, endDate) => set((s) => ({ wizard: { ...s.wizard, dates: { startDate, endDate } } })),
  setPet: (size, breed, temperament) => set((s) => ({ wizard: { ...s.wizard, pet: { size, breed, temperament } } })),
  setPreferences: (categories, pace, budgetLevel) => set((s) => ({ wizard: { ...s.wizard, preferences: { categories, pace, budgetLevel } } })),
  resetWizard: () => set({ wizard: { ...initialWizard } }),
  // Trip
  currentTrip: null,
  setCurrentTrip: (trip) => set({ currentTrip: trip, selectedDay: 1 }),
  selectedDay: 1,
  setSelectedDay: (day) => set({ selectedDay: day }),
  // Generation
  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),
  // BYOK — read from localStorage lazily
  geminiApiKey: typeof window !== 'undefined' ? (localStorage.getItem('pettrip_gemini_key') || '') : '',
  setGeminiApiKey: (key) => {
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('pettrip_gemini_key', key);
      } else {
        localStorage.removeItem('pettrip_gemini_key');
      }
    }
    set({ geminiApiKey: key });
  },
}));
