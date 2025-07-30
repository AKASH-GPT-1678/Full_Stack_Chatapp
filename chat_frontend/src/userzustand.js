// stores/useTempStore.js
import { create } from 'zustand';

const useTempStore = create((set) => ({
    tempData: '',
    setTempData: (data) => set({ tempData: data }),
}));

export default useTempStore;
