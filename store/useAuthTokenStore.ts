import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

interface AuthTokenStore {
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthTokenStore = create<AuthTokenStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setTokens: ({ access_token, refresh_token }) =>
        set({ accessToken: access_token, refreshToken: refresh_token }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "auth-tokens",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => () => {
        useAuthTokenStore.getState().setHasHydrated(true);
      },
    },
  ),
);

/** AsyncStorage에서 토큰 복원이 끝날 때까지 대기 */
export const waitForAuthHydration = () =>
  new Promise<void>((resolve) => {
    if (useAuthTokenStore.getState().hasHydrated) {
      resolve();
      return;
    }

    const unsubscribe = useAuthTokenStore.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
