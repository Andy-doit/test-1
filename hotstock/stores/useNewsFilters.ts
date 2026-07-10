"use client";

import { create } from "zustand";

interface NewsFiltersState {
  countryFilter: string;
  impactFilter: string;
  expandedDays: Record<string, boolean>;
  setCountryFilter: (value: string) => void;
  setImpactFilter: (value: string) => void;
  toggleDay: (dayId: string) => void;
  initializeDays: (dayIds: string[], defaultExpanded?: boolean) => void;
}

export const useNewsFiltersStore = create<NewsFiltersState>((set) => ({
  countryFilter: "all",
  impactFilter: "all",
  expandedDays: {},
  setCountryFilter: (value) => set({ countryFilter: value }),
  setImpactFilter: (value) => set({ impactFilter: value }),
  toggleDay: (dayId) =>
    set((state) => ({
      expandedDays: {
        ...state.expandedDays,
        [dayId]: !(state.expandedDays[dayId] ?? true),
      },
    })),
  initializeDays: (dayIds, defaultExpanded = true) =>
    set((state) => {
      if (Object.keys(state.expandedDays).length > 0) {
        return state;
      }

      const nextExpandedDays: Record<string, boolean> = {};
      dayIds.forEach((id) => {
        nextExpandedDays[id] = defaultExpanded;
      });

      return {
        ...state,
        expandedDays: nextExpandedDays,
      };
    }),
}));

