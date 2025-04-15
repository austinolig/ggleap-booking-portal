"use client";

import { useSelectionStore } from "@/stores";
import { addDays, format, isSameDay, set } from "date-fns";
import OptionButton from "../option-button";

export default function DateSelect() {
	const selectedDate = useSelectionStore((state) => state.selectedDate);
	const setSelectedDate = useSelectionStore((state) => state.setSelectedDate);

	const initialDate = set(new Date("APril 10 2025"), {
		hours: 10,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});
	const dates = [initialDate, addDays(initialDate, 1)];

	return (
		<div className="flex flex-col gap-3">
			<p className="font-bold text-muted-foreground">Date</p>
			<div className="grid grid-cols-2 gap-3">
				{dates.map((date) => (
					<OptionButton
						key={date.toISOString()}
						selected={isSameDay(selectedDate, date)}
						onClick={() => setSelectedDate(date.toISOString())}
					>
						{format(date, "MMMM dd")}
					</OptionButton>
				))}
			</div>
		</div>
	);
}
