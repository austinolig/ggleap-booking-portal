"use client";

import { useSelectedStore } from "@/stores";
import { addDays, format, isSameDay } from "date-fns";

export default function DateSelect() {
	const selectedDate = useSelectedStore((state) => state.selectedDate);
	const setSelectedDate = useSelectedStore((state) => state.setSelectedDate);

	const currentDate = new Date();
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
