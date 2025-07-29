import { create } from "zustand";
import { persist } from 'zustand/middleware';
const useIdStore = create(
  persist(

    (set) => ({
      value: "",
      setIdValue: (value) => set({ value }),

    }),

    {
      name: "userId",
    }
  ))

export default useIdStore;
