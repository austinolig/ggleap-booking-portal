import { create } from "zustand";
import { Machine } from "@/types";

type SelectionStore = {
	selectedDate: Date;
	selectedDuration: number;
	selectedTime: Date;
	selectedMachine: Machine | undefined;
	setSelectedDate: (date: Date) => void;
	setSelectedDuration: (duration: number) => void;
	setSelectedTime: (time: Date) => void;
	setSelectedMachine: (machine: Machine) => void;
};

const initialDate = new Date("April 10 2025");

export const useSelectionStore = create<SelectionStore>()((set) => ({
	selectedDate: initialDate,
	selectedDuration: 90,
	selectedTime: initialDate,
	selectedMachine: undefined,
	setSelectedDate: (date) => set({ selectedDate: date }),
	setSelectedDuration: (duration) => set({ selectedDuration: duration }),
	setSelectedTime: (time) => set({ selectedTime: time }),
	setSelectedMachine: (machine) => set({ selectedMachine: machine }),
}));

// Initializ state with props

// Store creator with createStore
import { createStore } from "zustand";

interface DateProps {
	selectedDate: Date;
}

interface DateState extends DateProps {
	setSelectedDate: (date: Date) => void;
}

type DateStore = ReturnType<typeof createDateStore>;

const createDateStore = (initProps?: Partial<DateProps>) => {
	const DEFAULT_PROPS: DateProps = {
		selectedDate: new Date("April 10 2025"),
	};
	return createStore<DateState>()((set) => ({
		...DEFAULT_PROPS,
		...initProps,
		setSelectedDate: (date) => set({ selectedDate: date }),
	}));
};

// Creating a context with React.createContext
import { createContext } from "react";

export const DateContext = createContext<DateStore | null>(null);

// Extracting context logic into a custom hook
// Mimic the hook returned by 'create'
import { useContext } from "react";
import { useStore } from "zustand";

export function useDateContext<T>(selector: (state: DateState) => T): T {
	const dateStore = useContext(DateContext);
	if (!dateStore) throw new Error("Missing DateContext.Provider in the tree");
	return useStore(dateStore, selector);
}
