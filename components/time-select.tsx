"use client";

import OptionButton from "./option-button";
import { format, isEqual } from "date-fns";
import { TimeSlot } from "@/types";
import { useSelectionStore } from "@/stores";

export default function TimeSlotSelect({
	timeSlots,
}: {
	timeSlots: TimeSlot[];
}) {
	const selectedTime = useSelectionStore((state) => state.selectedTime);
	const setSelectedTime = useSelectionStore((state) => state.setSelectedTime);
	return (
		<div>
			<p>Time ({format(selectedTime, "h:mm a")})</p>

			<div>
				{timeSlots.map((timeSlot) => (
					<OptionButton
						key={timeSlot.time.toISOString()}
						onClick={() => setSelectedTime(timeSlot.time)}
						selected={isEqual(timeSlot.time, selectedTime)}
					>
						{format(timeSlot.time, "h:mm a")} ({timeSlot.availablePCs}{" "}
						available)
					</OptionButton>
				))}
			</div>
		</div>
	);
}
