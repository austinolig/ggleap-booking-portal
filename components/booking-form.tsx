"use client";

import { useState } from "react";
import {
	addDays,
	addMinutes,
	compareAsc,
	format,
	getHours,
	isSameDay,
	set,
} from "date-fns";
import { Machine } from "@/lib/types/ggLeap";

export default function BookingForm() {
	const currentDate = new Date();
	const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
	const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
	const [availableMachines, setAvailableMachines] = useState<Machine[] | null>(
		null
	);

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

	const checkAvailabilty = async (dateTime: Date) => {
		setSelectedDateTime(dateTime);

		const bookingDateTime = dateTime.toISOString();

		const response = await fetch("/api/machines/check-availability/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				bookingDateTime: bookingDateTime,
			}),
		});

		const data = await response.json();

		if (!data.availableMachines || !response.ok) {
			console.log("data:", data);

			return;
		}

		setAvailableMachines(data.availableMachines);
	};

	const handleBook = async (machineUuid: string) => {
		if (!selectedDateTime) {
			console.log("No time selected");

			return;
		}

		const bookingDateTime = selectedDateTime.toISOString();

		const response = await fetch("/api/bookings/create/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				bookingDateTime: bookingDateTime,
				machineUuid: machineUuid,
			}),
		});

		const data = await response.json();

		if (!data.availableMachines || !response.ok) {
			console.log("data:", data);

			return;
		}

		// set confirmation text
	};

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
			<div>
				{allBookingDateTimes
					.filter((dateTime) => isSameDay(dateTime, selectedDate))
					.map((dateTime, index) => (
						<button
							key={index}
							className={`${
								compareAsc(dateTime, currentDate) === -1
									? "text-muted"
									: "text-primary"
							}`}
							onClick={() => checkAvailabilty(dateTime)}
						>
							{format(dateTime, "h:mm a")}
						</button>
					))}
			</div>
			<br />
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
			)}
		</div>
	);
}
