import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_PREFERENCES = {
  newsletter: true,
  sms: false,
  personalizedRecs: true,
  darkMode: false,
};

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  phone: "",
  birthday: "",
  location: "",
  avatarDataUrl: null,
  shadeProfile: null,
  preferences: DEFAULT_PREFERENCES,
};

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: {},

      getProfile: (uid) => get().profiles[uid] || DEFAULT_PROFILE,

      updateProfile: (uid, data) =>
        set((state) => ({
          profiles: {
            ...state.profiles,
            [uid]: { ...DEFAULT_PROFILE, ...state.profiles[uid], ...data },
          },
        })),

      updatePreference: (uid, key, value) =>
        set((state) => {
          const current = state.profiles[uid] || DEFAULT_PROFILE;
          return {
            profiles: {
              ...state.profiles,
              [uid]: {
                ...DEFAULT_PROFILE,
                ...current,
                preferences: { ...DEFAULT_PREFERENCES, ...current.preferences, [key]: value },
              },
            },
          };
        }),
    }),
    { name: "glowcart-profile" }
  )
);
