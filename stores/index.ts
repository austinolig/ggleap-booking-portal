import { create } from "zustand";

type SelectedStore = {
  selectedDate: Date;
  selectedTime: Date;
  selectedDuration: number;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: Date) => void;
  setSelectedDuration: (duration: number) => void;
};

const initialDate = new Date("March 27, 2025 10:00 AM");

export const useSelectedStore = create<SelectedStore>()((set) => ({
  selectedDate: initialDate,
  selectedTime: initialDate,
  selectedDuration: 90,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setSelectedDuration: (duration) => set({ selectedDuration: duration }),
}));
