import { format } from "date-fns";
import { TimeSlot } from "@/types";
import { Button } from "../ui/button";
import { memo } from "react";
import { Clock } from "lucide-react";

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
			<p className="font-bold text-muted-foreground flex items-center gap-2">
				<Clock width={16} />
				<span className="text-foreground">Time</span>
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
								size="lg"
								disabled={isDisabled}
							>
								<span>
									{format(timeSlot.time, "h:mm a")}<br />
									<span className="text-xs text-muted-foreground">
										{!isDisabled ? timeSlot.availablePCs : "0"} available
									</span>
								</span>
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
