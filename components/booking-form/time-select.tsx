import { format } from "date-fns";
import { TimeSlot } from "@/types";
import { Button } from "../ui/button";
import { memo } from "react";

export default memo(function TimeSlotSelect({
	timeSlots,
	selectedTime,
	setSelectedTime,
}: {
	timeSlots: TimeSlot[];
	selectedTime: Date | null;
	setSelectedTime: (time: Date) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			{/* display number of available timeslots instead? */}
			<p className="font-bold text-muted-foreground">
				Time ({selectedTime ? format(selectedTime, "h:mm a") : "X:XX XX"})
			</p>
			{timeSlots.length > 0 ? (
				<div className="grid grid-cols-2 gap-3">
					{timeSlots.map((timeSlot) => {
						const isSelected =
							timeSlot.time.getHours() === selectedTime?.getHours() &&
							timeSlot.time.getMinutes() === selectedTime?.getMinutes();
						const hasNoPCs = timeSlot.availablePCs === 0;
						const isDisabled = hasNoPCs;
						return (
							<Button
								key={timeSlot.time.toISOString()}
								onClick={() => setSelectedTime(timeSlot.time)}
								variant={isSelected ? "outlineSelected" : "outline"}
								disabled={isDisabled}
							>
								{format(timeSlot.time, "h:mm a")} ({!isDisabled ? timeSlot.availablePCs : "0"}{" "}
								available)
							</Button>
						);
					})}
				</div>
			) : (
				<p>No times available.</p>
			)}
		</div>
	);
});
