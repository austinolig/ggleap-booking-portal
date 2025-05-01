"use client";

import { CenterInfo, Machine } from "@/types";
import { use, useEffect, useMemo, useState } from "react";
import { getAvailableMachines, getAvailableTimeSlots } from "@/lib/utils";
import OptionButton from "./option-button";
import { Button } from "@/components/ui/button";
import { format, isEqual } from "date-fns";

export default function BookingForm({
	centerInfo,
}: {
	centerInfo: CenterInfo;
}) {
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

	useEffect(() => {
		setSelectedTime(timeSlots[0].time);
	}, [timeSlots]);

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

	useEffect(() => {
		setSelectedMachine(machines.find((machine) => machine.Available));
	}, [machines]);

	return (
		<div>
			<p>Date ({format(selectedDate, "MMMM d")})</p>
			<div>
				{dates.map((date) => (
					<OptionButton
						key={date.toISOString()}
						onClick={() => setSelectedDate(date)}
						selected={isEqual(date, selectedDate)}
					>
						{format(date, "MMMM d")}
					</OptionButton>
				))}
			</div>
			<p>Duration ({selectedDuration})</p>
			<div>
				{durations.map((duration) => (
					<OptionButton
						key={duration}
						onClick={() => setSelectedDuration(duration)}
						selected={duration === selectedDuration}
					>
						{duration} minutes
					</OptionButton>
				))}
			</div>
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
			<p>PC ({selectedMachine?.Name})</p>
			<div>
				{machines.map((machine) => (
					<OptionButton
						key={machine.Uuid}
						onClick={() => setSelectedMachine(machine)}
						selected={machine.Uuid === selectedMachine?.Uuid}
						disabled={!machine.Available}
					>
						{machine.Name}
					</OptionButton>
				))}
			</div>
			<Button>Book</Button>
		</div>
	);
}
