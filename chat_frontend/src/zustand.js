import { is } from "zod/v4/locales";
import { create } from "zustand";
import { persist } from 'zustand/middleware';
const useIdStore = create(
  persist(

    (set) => ({
      value: "",
      isLoggedIn: false,
      setTokenValue: (value) => set({ value }),
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),


    }),

    {
      name: "userId",
    }
  ));

export default useIdStore;
