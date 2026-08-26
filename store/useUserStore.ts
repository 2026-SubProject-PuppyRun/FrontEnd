import { create } from "zustand";

interface UserStore {
  nickName: string | null;
  setNickName: (nickName: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  nickName: null,
  setNickName: (nickName) => set({ nickName }),
}));
