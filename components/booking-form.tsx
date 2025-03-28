"use client";

import { useCallback, useEffect, useState } from "react";
import {
	addDays,
	addMinutes,
	// compareAsc,
	format,
	getHours,
	isSameDay,
	isSameMinute,
	set,
} from "date-fns";
import { Booking, Machine } from "@/lib/types/ggLeap";

// HARDCODED MACHINE DATA - eventually fetch this from API
const machines: Machine[] = [
	{ Uuid: "012965ab-3e68-461d-83a9-625ccd636369", Name: "PC2" },
	{ Uuid: "2047347d-f2c6-4307-9881-1de6f32527ec", Name: "PC7" },
	{ Uuid: "21116719-3c0b-45f9-bc6c-12f70a245851", Name: "PC9" },
	{ Uuid: "32e486b1-4dc1-4462-940f-79415750eeb8", Name: "PC6" },
	{ Uuid: "535126d8-8cce-4cb4-a4bd-37055f2fbd4b", Name: "PC4" },
	{ Uuid: "53ae2066-0e22-467f-a9fe-38c7d6aa3a74", Name: "PC5" },
	{ Uuid: "68bc1314-17d4-4039-ac63-a5b4b198de7c", Name: "PC8" },
	{ Uuid: "931e35e4-e28a-4ca3-b5b6-fc87625d346e", Name: "PC10" },
	{ Uuid: "dfcd4bdc-7c57-475d-b486-b842dcf0a9ba", Name: "PC3" },
	{ Uuid: "e0833473-359f-4c65-9b6a-1f7f22375a71", Name: "PC1" },
];

export default function BookingForm() {
	const currentDate = new Date("March 27, 2025");
	const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
	// const [duration, setDuration] = useState<number>(90);
	const [bookings, setBookings] = useState<Booking[]>([]);
	// const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
	// const [availableMachines, setAvailableMachines] = useState<Machine[] | null>(
	// 	null
	// );

	const numberOfBookingDates = 2;
	const firstHour = 10;
	const lastHour = 15;

	const allBookingDates: Date[] = [];
	const allBookingDateTimes: Date[] = [];

	const firstBookingDateTime = set(currentDate, {
		hours: firstHour,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	for (let i = 0; i < numberOfBookingDates; i++) {
		let newBookingDateTime = addDays(firstBookingDateTime, i);

		allBookingDates.push(newBookingDateTime);

		allBookingDateTimes.push(newBookingDateTime);

		while (getHours(newBookingDateTime) < lastHour) {
			newBookingDateTime = addMinutes(newBookingDateTime, 15);

			allBookingDateTimes.push(newBookingDateTime);
		}
	}

	const checkAvailabilty = useCallback(async () => {
		const bookingDate = selectedDate.toISOString();

		const response = await fetch("/api/bookings/get-bookings/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				bookingDate: bookingDate,
			}),
		});

		const data = await response.json();

		if (!data.bookings || !response.ok) {
			console.log("data:", data);

			return;
		}

		console.log(`Bookings for ${format(selectedDate, "yyyy-MM-dd")}:`, data);
		setBookings(data.bookings);
	}, [selectedDate]);

	useEffect(() => {
		checkAvailabilty();
	}, [selectedDate, checkAvailabilty]);

	// USE WITH ORIGINAL IMPLEMENTATION
	// const checkAvailabilty = async (dateTime: Date) => {
	// 	setSelectedDateTime(dateTime);

	// 	const bookingDateTime = dateTime.toISOString();

	// 	const response = await fetch("/api/machines/check-availability/", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			bookingDateTime: bookingDateTime,
	// 			duration: duration,
	// 		}),
	// 	});

	// 	const data = await response.json();

	// 	if (!data.availableMachines || !response.ok) {
	// 		console.log("data:", data);

	// 		return;
	// 	}

	// 	setAvailableMachines(data.availableMachines);
	// };

	// const handleBook = async (machineUuid: string) => {
	// 	if (!selectedDateTime) {
	// 		console.log("No time selected");

	// 		return;
	// 	}

	// 	const bookingDateTime = selectedDateTime.toISOString();

	// 	const response = await fetch("/api/bookings/create/", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			bookingDateTime: bookingDateTime,
	// 			machineUuid: machineUuid,
	// 		}),
	// 	});

	// 	const data = await response.json();

	// 	if (!data.availableMachines || !response.ok) {
	// 		console.log("data:", data);

	// 		return;
	// 	}

	// 	// set confirmation text
	// };

	return (
		<div>
			<p>Book Session</p>
			<br />
			<div>
				{allBookingDates.map((date, index) => (
					<button key={index} onClick={() => setSelectedDate(date)}>
						{format(date, "EEEE, MMMM dd, yyyy")}
					</button>
				))}
			</div>
			<br />
			{/* <div>
				<button onClick={() => setDuration(90)}>90 mins</button>
				<button onClick={() => setDuration(60)}>60 mins</button>
			</div> */}
			<br />
			<button onClick={checkAvailabilty}>View time slots</button>
			<br />
			<div className="flex flex-col">
				{allBookingDateTimes
					.filter((dateTime) => isSameDay(dateTime, selectedDate))
					.map((dateTime, index) => {
						const bookingsForDateTime = bookings.filter((booking) =>
							isSameMinute(new Date(booking.Start), dateTime)
						);

						const availableMachinesForDateTime = machines.filter(
							(machine) =>
								!bookingsForDateTime.some(
									(booking) => booking.Machines[0] === machine.Uuid
								)
						);

						return (
							<button key={index}>
								{format(dateTime, "h:mm a")} | {bookingsForDateTime.length} PCs
								booking | {availableMachinesForDateTime.length} PCs available
							</button>
						);
					})}
			</div>
			{/* 
			{selectedDateTime && (
				<p>
					Selected time:{" "}
					{format(selectedDateTime, "EEEE, MMMM dd, yyyy h:mm a")}
				</p>
			)}
			<br />
			{availableMachines && (
				<div>
					{availableMachines.map((machine, index) => (
						<button key={index} onClick={() => handleBook(machine.Uuid)}>
							Book {machine.Name}
						</button>
					))}
				</div>
			)} */}
		</div>
	);
}
