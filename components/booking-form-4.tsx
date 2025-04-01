"use client";

import { useSelectedStore } from "@/stores";
import { Booking } from "@/types";
import {
	addDays,
	addMinutes,
	format,
	getHours,
	getMinutes,
	isAfter,
	isBefore,
	isEqual,
	isSameDay,
	set,
	setMinutes,
} from "date-fns";
import { useMemo } from "react";

const allMachines = [
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

// MachineSelector
// TODO: Display only the available machines for the selected time
// initially all machines are available,
// at a specific time,
// loop through each machine and cross reference all bookings for any overlap,
// indicating isAvailable: false if any bookings overlap

const currentDate = new Date("March 27, 2025");
const dates = [currentDate, addDays(currentDate, 1)];
const durations = [90, 60];

const calculateTimes = () => {
	const startHour = 10;
	const endHour = 15;
	const minuteInterval = 15;

	const times: Date[] = [];

	let firstTime = set(currentDate, {
		hours: startHour,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	times.push(firstTime);

	for (let hour = startHour; hour < endHour; hour++) {
		for (let minute = 15; minute <= 60; minute += minuteInterval) {
			firstTime = setMinutes(firstTime, minute);
			times.push(firstTime);
		}
	}

	return times;
};

const times = calculateTimes();

// TimeSelector
// TODO: Display the number of available machines for each time
// initially all machines are available,
// loop through each time and cross reference all bookings for any overlap,
// removing the booked machines from the available list upon overlap

const hasOverlap = (potentialBooking: Booking, existingBooking: Booking) => {
	const potentialStart = new Date(potentialBooking.Start);
	const potentialEnd = addMinutes(potentialStart, potentialBooking.Duration);
	const existingStart = new Date(existingBooking.Start);
	const existingEnd = addMinutes(existingStart, existingBooking.Duration);

	return (
		isBefore(potentialStart, existingStart) &&
		isAfter(potentialEnd, existingEnd)
	);
	// return potentialStart < existingStart && potentialEnd > existingEnd;
};

// LEFT OFF HERE
// TODO GET REAL BOOKING DATA AND TEST
// pseudo code
// for each [time], check each [PC] if its available
//  for each [PC], check each related [booking] for overlap
//    for each [booking], check if [booking.time] overlaps with [time]
//      [PC] is available if no [booking.time] overlaps => increment count
//      otherwise [PC] is unavailable => go to next [PC]
// return => [time] with # of available [PC]
export default function BookingForm4({ bookings }: { bookings: Booking[] }) {
	const selectedDate = useSelectedStore((state) => state.selectedDate);
	const selectedDuration = useSelectedStore((state) => state.selectedDuration);

	const processedMachines = useMemo(() => {
		const processedMachines: Map<string, Booking[]> = new Map();

		bookings.forEach((booking) => {
			const startTime = new Date(booking.Start);
			const machineUuid = booking.Machines[0];

			if (!processedMachines.has(machineUuid)) {
				processedMachines.set(machineUuid, []);
			}

			const newBooking: Booking = {
				Start: startTime.toISOString(),
				Duration: booking.Duration,
				Machines: [machineUuid],
			};

			processedMachines.get(machineUuid)?.push(newBooking);
		});

		return processedMachines;
	}, [bookings]);

	const processedTimes = useMemo(() => {
		const dateToProcess = selectedDate;

		return times.map((time) => {
			const timeToProcess = set(dateToProcess, {
				hours: getHours(time),
				minutes: getMinutes(time),
				seconds: 0,
				milliseconds: 0,
			});

			const newBooking = {
				Start: timeToProcess.toISOString(),
				Duration: selectedDuration,
				Machines: [""],
			};

			let count = 0;

			for (const machine of allMachines) {
				const machineBookings = processedMachines.get(machine.Uuid);

				if (!machineBookings) {
					continue;
				}

				let isMachineAvailableForSlot = true;

				for (const booking of machineBookings) {
					if (hasOverlap(newBooking, booking)) {
						isMachineAvailableForSlot = false;
						break;
					}
				}

				if (isMachineAvailableForSlot) {
					count++;
				}
			}

			return {
				time: timeToProcess,
				bookings: count,
			};
		});
	}, [selectedDate, selectedDuration, processedMachines]);

	console.log("processedTimes", processedTimes);

	return (
		<div className="space-y-4">
			<DateSelector />
			<TimeSelector />
			<DurationSelector />
			<MachineSelector />
		</div>
	);
}

const DateSelector = () => {
	const selectedDate = useSelectedStore((state) => state.selectedDate);
	const setSelectedDate = useSelectedStore((state) => state.setSelectedDate);

	return (
		<div>
			<p className="font-bold">Select Date</p>
			<div className="flex flex-col items-start">
				{dates.map((date, index) => (
					<button
						key={index}
						className={`${
							isSameDay(selectedDate, date) ? "text-blue-500" : ""
						}`}
						onClick={() => setSelectedDate(date)}
					>
						{format(date, "EEE, MMM dd, yyyy")}
					</button>
				))}
			</div>
		</div>
	);
};

const TimeSelector = () => {
	const selectedTime = useSelectedStore((state) => state.selectedTime);
	const setSelectedTime = useSelectedStore((state) => state.setSelectedTime);

	return (
		<div>
			<p className="font-bold">Select Time</p>
			<div className="flex flex-col items-start">
				{times.map((time) => (
					<button
						key={time.toISOString()}
						className={`${isEqual(selectedTime, time) ? "text-blue-500" : ""}`}
						onClick={() => setSelectedTime(time)}
					>
						{format(time, "h:mm a")}
					</button>
				))}
			</div>
		</div>
	);
};

const DurationSelector = () => {
	const selectedDuration = useSelectedStore((state) => state.selectedDuration);
	const setSelectedDuration = useSelectedStore(
		(state) => state.setSelectedDuration
	);

	return (
		<div>
			<p className="font-bold">Select Duration</p>
			<div className="flex flex-col items-start">
				{durations.map((duration) => (
					<button
						key={duration}
						className={`${
							duration === selectedDuration ? "text-blue-500" : ""
						}`}
						onClick={() => setSelectedDuration(duration)}
					>
						{duration} minutes
					</button>
				))}
			</div>
		</div>
	);
};

const MachineSelector = () => {
	const bookPC = useSelectedStore((state) => state.bookPC);

	return (
		<div>
			<p className="font-bold">Select Machine</p>
			<div className="flex flex-col items-start">
				{allMachines.map((machine) => (
					<button
						key={machine.Uuid}
						className={"hover:text-blue-500"}
						onClick={() => bookPC(machine)}
					>
						{machine.Name}
					</button>
				))}
			</div>
		</div>
	);
};
