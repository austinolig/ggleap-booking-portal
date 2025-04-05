import { calculateTimes } from "@/lib/utils";
import { Machine, TimeAndAvailableMachines } from "@/types";
import { addDays } from "date-fns";
import { create } from "zustand";

type SelectedStore = {
  overlaps: Map<string, Set<string>>;
  selectedDate: Date;
  selectedTime: Date;
  selectedDuration: number;
  setOverlaps: (overlaps: Map<string, Set<string>>) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: Date) => void;
  setSelectedDuration: (duration: number) => void;
  bookPC: (machine: Machine) => void;
};

const initialDate = new Date();

export const useSelectedStore = create<SelectedStore>()((set, get) => ({
  overlaps: new Map<string, Set<string>>(),
  selectedDate: initialDate,
  selectedTime: initialDate,
  selectedDuration: 90,
  setOverlaps: (overlaps: Map<string, Set<string>>) => set({ overlaps }),
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

type DataStore = {
  durations: number[];
  dates: Date[];
  times: TimeAndAvailableMachines[];
  // machines: Machine[];
};

export const useDataStore = create<DataStore>()((set, get) => ({
  durations: [30, 60, 90, 120],
  dates: [initialDate, addDays(initialDate, 1)],
  times: await calculateTimes(), // => HOW TO DO THIS
  // machines: [],
}));
