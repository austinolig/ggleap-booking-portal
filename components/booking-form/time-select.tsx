"use client";

import { calculateTimes } from "@/lib/utils";
import { useSelectionStore } from "@/stores";
import { Booking, CenterHours, Machine } from "@/types";
import { format, isSameMinute } from "date-fns";

export default function TimeSelect({
	centerHours,
	bookings,
	allMachines,
}: {
	centerHours: CenterHours;
	bookings: Booking[];
	allMachines: Machine[];
}) {
	const selectedDate = useSelectionStore((state) => state.selectedDate);
	const selectedDuration = useSelectionStore((state) => state.selectedDuration);
	const selectedTime = useSelectionStore((state) => state.selectedTime);
	const setSelectedTime = useSelectionStore((state) => state.setSelectedTime);

	const times = calculateTimes(
		centerHours,
		allMachines,
		bookings,
		selectedDate,
		selectedDuration
	);

	if (!times) {
		return <div>Error fetching times</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{times.map(({ time, availableMachines }) => (
				<button
					key={time.toISOString()}
					className={isSameMinute(selectedTime, time) ? "text-blue-500" : ""}
					onClick={() => setSelectedTime(time)}
				>
					{format(time, "h:mm aaa")} ({availableMachines} available)
				</button>
			))}
		</div>
	);
}
