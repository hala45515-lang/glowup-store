import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_ROUTINES = [
  { id: 1, name: "Everyday Natural Look", pairs: [[1, 103], [2, 202], [3, 305], [5, 503], [6, 605]], count: 5, total: 63 },
  { id: 2, name: "Night Out Glam", pairs: [[1, 106], [2, 201], [3, 302], [4, 401], [4, 404], [5, 501], [6, 601]], count: 7, total: 329 },
];

export const useRoutinesStore = create(
  persist(
    (set, get) => ({
      routines: INITIAL_ROUTINES,

      addRoutine: (routine) => set({ routines: [...get().routines, routine] }),

      removeRoutine: (id) => set({ routines: get().routines.filter((r) => r.id !== id) }),

      renameRoutine: (id, name) =>
        set({ routines: get().routines.map((r) => (r.id === id ? { ...r, name } : r)) }),
    }),
    { name: "glowcart-routines" }
  )
);
