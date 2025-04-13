import { createBooking } from "@/lib/ggLeap";
import { set as setDateFns } from "date-fns";
import { create } from "zustand";

type SelectionStore = {
	selectedDate: string;
	selectedTimeSlot: string;
	selectedDuration: number;
	setSelectedDate: (date: string) => void;
	setSelectedTimeSlot: (time: string) => void;
	setSelectedDuration: (duration: number) => void;
	bookMachine: (machineUuid: string) => void;
};

const initialDate = setDateFns(new Date("April 10 2025"), {
	hours: 10,
	minutes: 0,
	seconds: 0,
	milliseconds: 0,
}).toISOString();

export const useSelectionStore = create<SelectionStore>()((set, get) => ({
	selectedDate: initialDate,
	selectedTimeSlot: initialDate,
	selectedDuration: 90,
	setSelectedDate: (date) =>
		set({ selectedDate: date, selectedTimeSlot: date }),
	setSelectedTimeSlot: (time) => set({ selectedTimeSlot: time }),
	setSelectedDuration: (duration) => set({ selectedDuration: duration }),
	bookMachine: async (machineUuid) => {
		await createBooking(
			get().selectedTimeSlot,
			get().selectedDuration,
			machineUuid
		);
	},
}));
