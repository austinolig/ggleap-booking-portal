"use client";

import { CenterInfo, Machine } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { getAvailableMachines, getAvailableTimeSlots } from "@/lib/utils";
import DateSelect from "./date-select";
import DurationSelect from "./duration-select";
import TimeSlotSelect from "./time-select";
import MachineSelect from "./machine-select";
import ConfirmationDrawer from "./confirmation-drawer";
import { addDays } from "date-fns";

const today = new Date();
const tomorrow = addDays(today, 1);
const dates = [today, tomorrow];
const durations = [60, 90];

export default function BookingForm({
	centerInfo,
}: {
	centerInfo: CenterInfo;
}) {
	const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);

	const [selectedDuration, setSelectedDuration] = useState<number>(
		durations[0]
	);

	const timeSlots = useMemo(() => {
		return getAvailableTimeSlots(centerInfo, selectedDate, selectedDuration);
	}, [centerInfo, selectedDate, selectedDuration]);

	const [selectedTime, setSelectedTime] = useState<Date | null>(
		timeSlots.find((timeSlot) => timeSlot.availablePCs > 0)?.time ?? null
	);

	useEffect(() => {
		const firstAvailableTime = timeSlots.find((timeSlot) => timeSlot.availablePCs > 0)?.time ?? null;
		setSelectedTime(firstAvailableTime);
	}, [timeSlots]);

	const machines = useMemo(() => {
		return getAvailableMachines(centerInfo, selectedTime, selectedDuration);
	}, [centerInfo, selectedTime, selectedDuration]);

	const [selectedMachine, setSelectedMachine] = useState<Machine | null>(
		machines.find((machine) => machine.Available) ?? null
	);

	useEffect(() => {
		const firstAvailableMachine = machines.find((machine) => machine.Available) ?? null;
		setSelectedMachine(firstAvailableMachine);
	}, [machines]);

	return (
		<div className="space-y-6">
			<p className="font-bold text-lg">Create a booking</p>
			<DateSelect
				dates={dates}
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
			/>
			<DurationSelect
				durations={durations}
				selectedDuration={selectedDuration}
				setSelectedDuration={setSelectedDuration}
			/>
			<TimeSlotSelect
				timeSlots={timeSlots}
				selectedTime={selectedTime}
				setSelectedTime={setSelectedTime}
			/>
			<MachineSelect
				machines={machines}
				selectedMachine={selectedMachine}
				setSelectedMachine={setSelectedMachine}
			/>
			<ConfirmationDrawer
				selectedDate={selectedDate}
				selectedDuration={selectedDuration}
				selectedTime={selectedTime}
				selectedMachine={selectedMachine}
			/>
		</div>
	);
}
