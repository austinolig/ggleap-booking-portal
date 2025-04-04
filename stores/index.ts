import { Machine } from "@/types";
import { create } from "zustand";

type SelectedStore = {
	selectedDate: Date;
	selectedTime: Date;
	selectedDuration: number;
	setSelectedDate: (date: Date) => void;
	setSelectedTime: (time: Date) => void;
	setSelectedDuration: (duration: number) => void;
	bookPC: (machine: Machine) => void;
};

const initialDate = new Date();

export const useSelectedStore = create<SelectedStore>()((set, get) => ({
	selectedDate: initialDate,
	selectedTime: initialDate,
	selectedDuration: 90,
	setSelectedDate: (date) => set({ selectedDate: date }),
	setSelectedTime: (time) => set({ selectedTime: time }),
	setSelectedDuration: (duration) => set({ selectedDuration: duration }),
	bookPC: (machine: Machine) => {
		const { selectedDate, selectedTime, selectedDuration } = get();

		alert(
			`Booking ${
				machine.Name
			} on ${selectedDate.toLocaleDateString()} at ${selectedTime.toLocaleTimeString()} for ${selectedDuration} minutes`
		);
	},
}));
