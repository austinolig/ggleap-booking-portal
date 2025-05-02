"use client";

import { CenterInfo, Machine } from "@/types";
import { useMemo, useRef, useState } from "react";
import { getAvailableMachines, getAvailableTimeSlots } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DateSelect from "./date-select";
import DurationSelect from "./duration-select";
import TimeSlotSelect from "./time-select";
import MachineSelect from "./machine-select";

export default function BookingForm({
	centerInfo,
}: {
	centerInfo: CenterInfo;
}) {
	// add provider for date store

	const dates = [new Date("April 10 2025"), new Date("April 11 2025")];
	const durations = [90, 60];

	const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
	const [selectedDuration, setSelectedDuration] = useState<number>(
		durations[0]
	);

	const timeSlots = useMemo(() => {
		return getAvailableTimeSlots(centerInfo, selectedDate, selectedDuration);
	}, [centerInfo, selectedDate, selectedDuration]);

	if (!timeSlots) {
		return (
			<div>
				<p>No time slots available</p>
			</div>
		);
	}

	const [selectedTime, setSelectedTime] = useState<Date>(timeSlots[0].time);

	const machines = useMemo(() => {
		return getAvailableMachines(centerInfo, selectedTime, selectedDuration);
	}, [centerInfo, selectedTime, selectedDuration]);

	if (!machines) {
		return (
			<div>
				<p>No machines available</p>
			</div>
		);
	}

	const [selectedMachine, setSelectedMachine] = useState<Machine | undefined>(
		machines.find((machine) => machine.Available)
	);

	return (
		<div>
			<DateContext.Provider value={dateStore}>
				<DateSelect dates={dates} />
			</DateContext.Provider>
			<DurationSelect durations={durations} />
			<TimeSlotSelect timeSlots={timeSlots} />
			<MachineSelect machines={machines} />
			<Button>Book</Button>
		</div>
	);
}
