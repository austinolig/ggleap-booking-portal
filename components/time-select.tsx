"use client";

import React, { useState } from "react";
import OptionButton from "./option-button";
import { format } from "date-fns";
import { TimeSlot } from "@/types";

export default function TimeSlotSelect({
	timeSlots,
}: {
	timeSlots: TimeSlot[];
}) {
	const [selectedTime, setSelectedTime] = useState<Date>(timeSlots[0].time);

	return (
		<div>
			{timeSlots.map((timeSlot) => (
				<OptionButton
					key={timeSlot.time.toISOString()}
					onClick={() => setSelectedTime(timeSlot.time)}
					selected={timeSlot.time === selectedTime}
				>
					{format(timeSlot.time, "h:mm a")} ({timeSlot.availablePCs} available)
				</OptionButton>
			))}
		</div>
	);
}
