"use client";

import { useState } from "react";
import {
	addDays,
	addMinutes,
	format,
	getDate,
	getHours,
	isSameDay,
	isSameMinute,
	set,
} from "date-fns";
import { Machine } from "@/lib/types/ggLeap"; // Assuming types are defined correctly
// import { LoaderCircle } from "lucide-react";

// HARDCODED MACHINE DATA - eventually fetch this from API
const allMachines: Machine[] = [
	{ Uuid: "e0833473-359f-4c65-9b6a-1f7f22375a71", Name: "PC1" },
	{ Uuid: "012965ab-3e68-461d-83a9-625ccd636369", Name: "PC2" },
	{ Uuid: "dfcd4bdc-7c57-475d-b486-b842dcf0a9ba", Name: "PC3" },
	{ Uuid: "535126d8-8cce-4cb4-a4bd-37055f2fbd4b", Name: "PC4" },
	{ Uuid: "53ae2066-0e22-467f-a9fe-38c7d6aa3a74", Name: "PC5" },
	{ Uuid: "32e486b1-4dc1-4462-940f-79415750eeb8", Name: "PC6" },
	{ Uuid: "2047347d-f2c6-4307-9881-1de6f32527ec", Name: "PC7" },
	{ Uuid: "68bc1314-17d4-4039-ac63-a5b4b198de7c", Name: "PC8" },
	{ Uuid: "21116719-3c0b-45f9-bc6c-12f70a245851", Name: "PC9" },
	{ Uuid: "931e35e4-e28a-4ca3-b5b6-fc87625d346e", Name: "PC10" },
];

const currentDate = new Date("March 27, 2025");

export default function BookingForm3() {
	// const [loading, setLoading] = useState<boolean>(false);
	const [selectedDuration, setSelectedDuration] = useState<number>(90);
	const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

	const numberOfBookingDates = 2;
	const firstHour = 10;
	const lastHour = 15;
	const timeSlotIncrement = 15;

	const bookingDates: Date[] = [];
	const timeSlots: Date[] = [];

	const firstTimeSlotDate = set(currentDate, {
		hours: firstHour,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	for (let i = 0; i < numberOfBookingDates; i++) {
		let currentTimeSlot = addDays(firstTimeSlotDate, i);

		bookingDates.push(currentTimeSlot);
		timeSlots.push(currentTimeSlot);

		while (getHours(currentTimeSlot) < lastHour) {
			currentTimeSlot = addMinutes(currentTimeSlot, timeSlotIncrement);

			timeSlots.push(currentTimeSlot);
		}
	}

	const [selectedTimeSlotDate, setSelectedTimeSlotDate] = useState<Date>(
		timeSlots[0]
	);

	const filteredTimeSlots = timeSlots.filter((timeSlot) =>
		isSameDay(selectedDate, timeSlot)
	);

	const changeSelectedDate = (date: Date) => {
		if (isSameDay(selectedDate, date)) {
			return;
		}

		setSelectedDate(date);

		const newSelectedTimeSlot = set(selectedTimeSlotDate, {
			date: getDate(date),
		});

		setSelectedTimeSlotDate(newSelectedTimeSlot);
	};

	const changeSelectedTimeSlot = (timeSlot: Date) => {
		if (isSameMinute(selectedTimeSlotDate, timeSlot)) {
			return;
		}

		setSelectedTimeSlotDate(timeSlot);
	};

	const bookPC = async (machine: Machine) => {
		alert(
			`Booked ${machine.Name}: ${format(
				selectedTimeSlotDate,
				"MMM dd, yyyy 'at' h:mm a"
			)} (${selectedDuration} mins)`
		);

		// const bookingDateTime = selectedTimeSlotDate.toISOString();
		// const machineUuid = machine.Uuid;

		// const response = await fetch("/api/bookings/create/", {
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" },
		// 	body: JSON.stringify({
		// 		bookingDateTime: bookingDateTime,
		// 		machineUuid: machineUuid,
		// 	}),
		// });

		// const data = await response.json();

		// if (!data.bookingUuid || !response.ok) {
		// 	console.log("data:", data);
		// 	return;
		// }

		// console.log("Booking created:", data.bookingUuid);
	};

	// if (loading) {
	// 	return (
	// 		<div className="flex items-center justify-center p-10">
	// 			<LoaderCircle className="animate-spin text-blue-500" />
	// 		</div>
	// 	);
	// }

	return (
		<div className="space-y-6">
			<div>
				<p className="font-bold mb-2">Date</p>
				<div className="grid grid-cols-2 gap-2">
					{bookingDates.map((date, index) => (
						<button
							key={index}
							className={`p-2 border rounded cursor-pointer  ${
								isSameDay(selectedDate, date)
									? "text-blue-500"
									: "hover:text-blue-200"
							}`}
							// onClick={() => changeSelectedDate(date)}
							onClick={() => changeSelectedDate(date)}
						>
							{format(date, "EEE, MMM dd, yyyy")}
						</button>
					))}
				</div>
			</div>
			<div>
				<p className="font-bold mb-2">Time</p>
				<div className="grid grid-cols-3 gap-2">
					{filteredTimeSlots.map((timeSlot) => (
						<button
							key={timeSlot.toISOString()}
							className={`p-2 border rounded cursor-pointer ${
								selectedTimeSlotDate.getTime() === timeSlot.getTime()
									? "text-blue-500"
									: "text-white hover:text-blue-200"
							}`}
							// disabled={timeSlot.availableMachines === 0}
							onClick={() => changeSelectedTimeSlot(timeSlot)}
						>
							{format(timeSlot, "h:mm a")}
						</button>
					))}
				</div>
			</div>
			<div>
				<p className="font-bold mb-2">Duration</p>
				<div className="grid grid-cols-2 gap-2">
					{[90, 60].map((duration) => (
						<button
							key={duration}
							className={`p-2 border rounded cursor-pointer ${
								selectedDuration === duration
									? "text-blue-500"
									: "hover:text-blue-200"
							}`}
							onClick={() => setSelectedDuration(duration)}
						>
							{duration} mins
						</button>
					))}
				</div>
			</div>
			<div>
				<p className="font-bold mb-2">PCs</p>
				<div className="grid grid-cols-2 gap-2">
					{allMachines.map((machine) => (
						<button
							key={machine.Uuid}
							className={`p-2 border rounded cursor-pointer hover:text-blue-200`}
							onClick={() => bookPC(machine)}
						>
							{machine.Name}
						</button>
					))}
				</div>
			</div>
			{/* 
			
			<div>
				<p className="font-bold mb-2">PCs</p>
				{selectedTimeSlotDate && !isNaN(selectedTimeSlotDate.getTime()) ? (
					<div className="grid grid-cols-2 gap-2">
						{machinesOnSelectedDate.map((machine) => (
							<button
								key={machine.Uuid}
								className={`p-2 border rounded cursor-pointer ${
									machine.isAvailable
										? "text-white hover:text-blue-200"
										: "text-muted border-muted cursor-not-allowed"
								}`}
								disabled={!machine.isAvailable}
								onClick={() =>
									alert(
										`Simulate Booking ${machine.Name} for: ${format(
											selectedTimeSlotDate,
											"MMM dd, yyyy 'at' h:mm a"
										)} for ${selectedDuration} mins`
									)
								}
							>
								{machine.Name}
							</button>
						))}
					</div>
				) : (
					<p className="text-gray-500 text-sm">
						Please select a valid time slot to see available machines.
					</p>
				)}
			</div> */}
		</div>
	);
}
