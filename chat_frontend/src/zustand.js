import {create} from "zustand";

const useIdStore = create((set) => ({
  value: "",

  // function to update the value
  setIdValue: (newId) => set({ value: newId })
}));

export default useIdStore;
