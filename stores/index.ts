import { create } from "zustand";

type SelectionStore = {
	selectedDate: Date;
	selectedTime: Date;
	selectedDuration: number;
	setSelectedDate: (date: Date) => void;
	setSelectedTime: (time: Date) => void;
	setSelectedDuration: (duration: number) => void;
};

const initialDate = new Date("April 3 2025");

export const useSelectionStore = create<SelectionStore>()((set, get) => ({
	selectedDate: initialDate,
	selectedTime: initialDate,
	selectedDuration: 90,
	setSelectedDate: (date) => set({ selectedDate: date }),
	setSelectedTime: (time) => set({ selectedTime: time }),
	setSelectedDuration: (duration) => set({ selectedDuration: duration }),
}));
