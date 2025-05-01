"use client";

import { calculateTimeSlots } from "@/lib/utils";
import { useSelectionStore } from "@/stores";
import { CenterInfo } from "@/types";
import { format } from "date-fns";
import OptionButton from "../option-button";
import { Button } from "../ui/button";

export default function TimeSelect({ centerInfo }: { centerInfo: CenterInfo }) {
	const selectedDate = useSelectionStore((state) => state.selectedDate);
	const selectedDuration = useSelectionStore((state) => state.selectedDuration);
	const selectedTimeSlot = useSelectionStore((state) => state.selectedTimeSlot);
	const setSelectedTimeSlot = useSelectionStore(
		(state) => state.setSelectedTimeSlot
	);
	const bookMachine = useSelectionStore((state) => state.bookMachine);

	const timeSlots = calculateTimeSlots(
		centerInfo,
		selectedDate,
		selectedDuration
	);

	if (!timeSlots) {
		return (
			<div>
				<p className="font-bold text-muted-foreground">Time</p>
				<p className="">No time slots available</p>
			</div>
		);
	}

	const machines = timeSlots[selectedTimeSlot]?.machineList;

	if (!machines) {
		<div>
			<p className="font-bold text-muted-foreground">PC</p>
			<p className="">No PCs available</p>
		</div>;
	}

	return (
		<>
			<div className="flex flex-col gap-3">
				<p className="font-bold text-muted-foreground">Time</p>
				<div className="grid grid-cols-2 gap-3">
					{Object.keys(timeSlots).map((timeSlot) => (
						<OptionButton
							key={timeSlot}
							onClick={() => setSelectedTimeSlot(timeSlot)}
							selected={selectedTimeSlot === timeSlot}
							disabled={timeSlots[timeSlot].availableMachinesCount === 0}
						>
							{format(new Date(timeSlot), "h:mm aaa")}
							<br />({timeSlots[timeSlot].availableMachinesCount} available)
						</OptionButton>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<p className="font-bold text-muted-foreground">PC</p>
				<div className="grid grid-cols-5 gap-3">
					{machines.map((machine) => (
						<OptionButton
							key={machine.Uuid}
							onClick={() => bookMachine(machine.Uuid)}
							selected={false}
							disabled={!machine.Available}
						>
							{machine.Name}
						</OptionButton>
					))}
				</div>
			</div>
			<Button className="w-full cursor-pointer">Confirm Booking</Button>
		</>
	);
}
