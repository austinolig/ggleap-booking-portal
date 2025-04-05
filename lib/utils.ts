import { clsx, type ClassValue } from "clsx";
import { addMinutes, format, isAfter, isBefore, set } from "date-fns";
import { twMerge } from "tailwind-merge";
import {
	Booking,
	CenterHours,
	Machine,
	TimeAndAvailableMachines,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function calculateTimes(
	centerHours: CenterHours,
	allMachines: Machine[],
	bookings: Booking[],
	selectedDate: Date,
	selectedDuration: number
): TimeAndAvailableMachines[] | null {
	const dayOfWeek = format(selectedDate, "EEEE");
	const dateString = format(selectedDate, "yyyy-MM-dd");

	// check if center is open on selected date
	if (!centerHours.Regular[dayOfWeek][0]?.Open) {
		return null;
	}

	const regularHours = {
		openTime: centerHours.Regular[dayOfWeek][0].Open,
		closeTime: centerHours.Regular[dayOfWeek][0].Close,
	};

	const [regularOpenHour, regularOpenMinute] = regularHours.openTime.split(":");
	const [regularCloseHour, regularCloseMinute] =
		regularHours.closeTime.split(":");

	const regularStartTime = set(selectedDate, {
		hours: parseInt(regularOpenHour),
		minutes: parseInt(regularOpenMinute),
		seconds: 0,
		milliseconds: 0,
	});

	const regularEndTime = set(selectedDate, {
		hours: parseInt(regularCloseHour),
		minutes: parseInt(regularCloseMinute) - 60, // subtract shortest possible duration (60) from closing time
		seconds: 0,
		milliseconds: 0,
	});

	let specialHours = regularHours;
	if (centerHours.Special[dateString]) {
		specialHours = {
			openTime: centerHours.Special[dateString][0].Open,
			closeTime: centerHours.Special[dateString][0].Close,
		};
	}
	const [specialOpenHour, specialOpenMinute] = specialHours.openTime.split(":");
	const [specialCloseHour, specialCloseMinute] =
		specialHours.closeTime.split(":");

	const specialStartTime = set(selectedDate, {
		hours: parseInt(specialOpenHour),
		minutes: parseInt(specialOpenMinute),
		seconds: 0,
		milliseconds: 0,
	});

	const specialEndTime = set(selectedDate, {
		hours: parseInt(specialCloseHour),
		minutes: parseInt(specialCloseMinute) - selectedDuration,
		seconds: 0,
		milliseconds: 0,
	});

	const times = [];
	const slotInterval = 15; // minutes
	const totalMachines = allMachines.length;

	let slotStartTime = regularStartTime;
	const slotEndTime = addMinutes(slotStartTime, selectedDuration);

	const totalOccupiedMachines = getTotalOccupiedMachines(
		slotStartTime,
		slotEndTime,
		specialStartTime,
		specialEndTime,
		bookings,
		totalMachines
	);

	times.push({
		time: slotStartTime,
		availableMachines: totalMachines - totalOccupiedMachines,
	});

	while (isBefore(slotStartTime, regularEndTime)) {
		slotStartTime = addMinutes(slotStartTime, slotInterval);
		const slotEndTime = addMinutes(slotStartTime, selectedDuration);

		const totalOccupiedMachines = getTotalOccupiedMachines(
			slotStartTime,
			slotEndTime,
			specialStartTime,
			specialEndTime,
			bookings,
			totalMachines
		);

		times.push({
			time: slotStartTime,
			availableMachines: totalMachines - totalOccupiedMachines,
		});
	}

	return times;
}

function getTotalOccupiedMachines(
	slotStartTime: Date,
	slotEndTime: Date,
	specialStartTime: Date,
	specialEndTime: Date,
	bookings: Booking[],
	totalMachines: number
): number {
	let totalOccupiedMachines = 0;

	const occupiedMachines = new Set();

	if (
		isBefore(slotStartTime, specialStartTime) ||
		isAfter(slotStartTime, specialEndTime)
	) {
		totalOccupiedMachines = totalMachines;
	} else {
		for (const booking of bookings) {
			const bookingStartTime = new Date(booking.Start);
			const bookingEndTime = addMinutes(bookingStartTime, booking.Duration);

			if (
				isBefore(slotStartTime, bookingEndTime) &&
				isAfter(slotEndTime, bookingStartTime)
			) {
				occupiedMachines.add(booking.Machines[0]);
			}
		}

		totalOccupiedMachines = occupiedMachines.size;
	}
	return totalOccupiedMachines;
}
