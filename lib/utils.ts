import { useSelectedStore } from "@/stores";
import { clsx, type ClassValue } from "clsx";
import { addMinutes, format, isAfter, isBefore, set } from "date-fns";
import { twMerge } from "tailwind-merge";
import { getAllMachines, getBookings, getCenterHours } from "./ggLeap";
import { TimeAndAvailableMachines } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function calculateTimes(): Promise<
	TimeAndAvailableMachines[] | null
> {
	const centerHours = await getCenterHours();
	const allMachines = await getAllMachines();
	const bookings = await getBookings();

	if (!centerHours || !allMachines || !bookings) {
		return null;
	}

	const selectedDuration = useSelectedStore((state) => state.selectedDuration);
	const selectedDate = useSelectedStore((state) => state.selectedDate);
	const dayOfWeek = format(selectedDate, "EEEE");

	// check if center is open on selected date
	// if (!centerHours.Regular[dayOfWeek][0]?.Open) {
	//   return <div>Center is closed on {dayOfWeek}.</div>;
	// }

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
	const occupiedMachinesByTime = new Map<string, Set<string>>();
	const totalMachines = allMachines.length;
	let totalOccupiedMachines = 0;

	if (isBefore(potentialBookingStart, specialStartTime)) {
		totalOccupiedMachines = totalMachines;
	}

	for (const booking of bookings) {
		const bookingStartTime = new Date(booking.Start);
		const bookingEndTime = addMinutes(bookingStartTime, booking.Duration);
		if (
			isBefore(potentialBookingStart, bookingEndTime) &&
			isAfter(potentialBookingEnd, bookingStartTime)
		) {
			if (!occupiedMachinesByTime.has(potentialBookingStart.toISOString())) {
				occupiedMachinesByTime.set(
					potentialBookingStart.toISOString(),
					new Set()
				);
			}

			occupiedMachinesByTime
				.get(potentialBookingStart.toISOString())
				?.add(booking.Machines[0]);
		}
	}

	totalOccupiedMachines =
		occupiedMachinesByTime.get(potentialBookingStart.toISOString())?.size ?? 0;
	// memoize times
	const times = [
		{
			time: potentialBookingStart,
			availableMachines: totalMachines - totalOccupiedMachines,
		},
	];

	const bookingInterval = 15; // minutes
	while (isBefore(potentialBookingStart, regularEndTime)) {
		potentialBookingStart = addMinutes(potentialBookingStart, bookingInterval);
		potentialBookingEnd = addMinutes(potentialBookingStart, selectedDuration);
		totalOccupiedMachines = 0;

		if (
			isBefore(potentialBookingStart, specialStartTime) ||
			isAfter(potentialBookingStart, specialEndTime)
		) {
			totalOccupiedMachines = totalMachines;
		} else {
			for (const booking of bookings) {
				const bookingStartTime = new Date(booking.Start);
				const bookingEndTime = addMinutes(bookingStartTime, booking.Duration);
				if (
					isBefore(potentialBookingStart, bookingEndTime) &&
					isAfter(potentialBookingEnd, bookingStartTime)
				) {
					if (
						!occupiedMachinesByTime.has(potentialBookingStart.toISOString())
					) {
						occupiedMachinesByTime.set(
							potentialBookingStart.toISOString(),
							new Set()
						);
					}

					occupiedMachinesByTime
						.get(potentialBookingStart.toISOString())
						?.add(booking.Machines[0]);
				}
			}
			totalOccupiedMachines =
				occupiedMachinesByTime.get(potentialBookingStart.toISOString())?.size ??
				0;
		}

		times.push({
			time: potentialBookingStart,
			availableMachines: totalMachines - totalOccupiedMachines,
		});
	}

	return times;
}
