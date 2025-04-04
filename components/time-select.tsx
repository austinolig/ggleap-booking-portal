"use client";

import { useSelectedStore } from "@/stores";
import { Booking, CenterHours, Machine } from "@/types";
import {
	addMinutes,
	format,
	isAfter,
	isBefore,
	isSameMinute,
	set,
} from "date-fns";

export default function TimeSelect({
	centerHours,
	bookings,
	allMachines,
}: {
	centerHours: CenterHours;
	bookings: Booking[];
	allMachines: Machine[];
}) {
	// initialize available times between center (special) hours with 15 mininute intervals
	// generate available machines based on existing bookings

	const selectedTime = useSelectedStore((state) => state.selectedTime);
	const setSelectedTime = useSelectedStore((state) => state.setSelectedTime);
	const selectedDuration = useSelectedStore((state) => state.selectedDuration);
	const selectedDate = useSelectedStore((state) => state.selectedDate);
	const dayOfWeek = format(selectedDate, "EEEE");

	// check if center is open on selected date
	if (!centerHours.Regular[dayOfWeek][0]?.Open) {
		return <div>Center is closed on {dayOfWeek}.</div>;
	}

	// check center regular hours
	// split "HH:mm" value into [HH, mm]
	const [regularOpenHour, regularOpenMinute] =
		centerHours.Regular[dayOfWeek][0].Open.split(":");
	const [regularClosingHour, regularClosingMinute] =
		centerHours.Regular[dayOfWeek][0].Close.split(":");

	let [specialOpenHour, specialOpenMinute] = [
		regularOpenHour,
		regularOpenMinute,
	];
	let [specialClosingHour, specialClosingMinute] = [
		regularClosingHour,
		regularClosingMinute,
	];

	// check center special hours
	const dateString = format(selectedDate, "yyyy-MM-dd");
	if (centerHours.Special[dateString]) {
		[specialOpenHour, specialOpenMinute] =
			centerHours.Special[dateString][0].Open.split(":");
		[specialClosingHour, specialClosingMinute] =
			centerHours.Special[dateString][0].Close.split(":");
	}

	const regularStartTime = set(selectedDate, {
		hours: parseInt(regularOpenHour),
		minutes: parseInt(regularOpenMinute),
		seconds: 0,
		milliseconds: 0,
	});
	const regularEndTime = set(regularStartTime, {
		hours: parseInt(regularClosingHour),
		minutes: parseInt(regularClosingMinute) - 60, // subtract shorted possible duration (60) from closing time
	});

	const specialStartTime = set(selectedDate, {
		hours: parseInt(specialOpenHour),
		minutes: parseInt(specialOpenMinute),
		seconds: 0,
		milliseconds: 0,
	});
	const specialEndTime = set(specialStartTime, {
		hours: parseInt(specialClosingHour),
		minutes: parseInt(specialClosingMinute) - selectedDuration,
	});

	let potentialBookingStart = regularStartTime;
	let potentialBookingEnd = addMinutes(potentialBookingStart, selectedDuration);
	let availableMachines = allMachines.length;

	if (isBefore(potentialBookingStart, specialStartTime)) {
		availableMachines = 0;
	}

	for (const booking of bookings) {
		const bookingStartTime = new Date(booking.Start);
		const bookingEndTime = addMinutes(bookingStartTime, booking.Duration);
		if (
			isBefore(potentialBookingStart, bookingEndTime) &&
			isAfter(potentialBookingEnd, bookingStartTime)
		) {
			availableMachines--;
		}
	}

	const bookingInterval = 15; // minutes
	// memoize times
	const times = [
		{ time: potentialBookingStart, availableMachines: availableMachines },
	];

	while (isBefore(potentialBookingStart, regularEndTime)) {
		potentialBookingStart = addMinutes(potentialBookingStart, bookingInterval);
		potentialBookingEnd = addMinutes(potentialBookingStart, selectedDuration);
		availableMachines = allMachines.length;
		if (
			isBefore(potentialBookingStart, specialStartTime) ||
			isAfter(potentialBookingStart, specialEndTime)
		) {
			availableMachines = 0;
		} else {
			for (const booking of bookings) {
				const bookingStartTime = new Date(booking.Start);
				const bookingEndTime = addMinutes(bookingStartTime, booking.Duration);
				if (
					isBefore(potentialBookingStart, bookingEndTime) &&
					isAfter(potentialBookingEnd, bookingStartTime)
				) {
					availableMachines--;
				}
			}
		}

		times.push({
			time: potentialBookingStart,
			availableMachines: availableMachines,
		});
	}

	console.log("times", times);
	console.log("selectedTime", selectedTime);

	return (
		<div className="flex flex-col gap-2">
			{times.map(({ time, availableMachines }) => (
				<button
					key={time.toISOString()}
					className={isSameMinute(selectedTime, time) ? "text-blue-500" : ""}
					onClick={() => setSelectedTime(time)}
				>
					{format(time, "h:mm aaa")} ({availableMachines} available)
				</button>
			))}
		</div>
	);
}
