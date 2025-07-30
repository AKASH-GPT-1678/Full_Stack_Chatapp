import { create } from "zustand";
import { persist } from 'zustand/middleware';
const useIdStore = create(
  persist(

    (set) => ({
      value: "",
      setTokenValue: (value) => set({ value }),

    }),

    {
      name: "userId",
    }
  ));

export default useIdStore;
