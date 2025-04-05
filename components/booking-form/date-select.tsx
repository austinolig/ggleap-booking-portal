"use client";

import { useSelectionStore } from "@/stores";
import { addDays, format, isSameDay } from "date-fns";

export default function DateSelect() {
	const selectedDate = useSelectionStore((state) => state.selectedDate);
	const setSelectedDate = useSelectionStore((state) => state.setSelectedDate);

	const currentDate = new Date("April 3 2025");
	const dates = [currentDate, addDays(currentDate, 1)];

	return (
		<div>
			{dates.map((date) => (
				<button
					key={date.toISOString()}
					className={isSameDay(selectedDate, date) ? "text-blue-500" : ""}
					onClick={() => setSelectedDate(date)}
				>
					{format(date, "MMM dd, yyyy")}
				</button>
			))}
		</div>
	);
}
