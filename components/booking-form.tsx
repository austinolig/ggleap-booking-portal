"use client";

import { useEffect, useState } from "react";
import {
	addDays,
	addMinutes,
	format,
	getHours,
	isSameDay,
	set,
} from "date-fns";
import { MachinesResponse } from "@/lib/types/ggLeap";

export default function BookingForm() {
	const currentDateTime = new Date();
	const [selectedDate, setSelectedDate] = useState(currentDateTime);
	const [selectedTime, setSelectedTime] = useState<Date | null>(null);
	const [availableMachines, setAvailableMachines] = useState<MachinesResponse>({
		Machines: [],
	});

	const totalBookingDates = 2;
	const initalBookingHour = 10;
	const finalBookingHour = 15;
	const initialBookingDate = set(currentDateTime, {
		hours: initalBookingHour,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	const bookingDates: Date[] = [];
	const bookingTimes: Date[] = [];

	for (let i = 0; i < totalBookingDates; i++) {
		let newBookingTime = addDays(initialBookingDate, i);

		bookingTimes.push(newBookingTime);
		bookingDates.push(newBookingTime);

		while (getHours(newBookingTime) < finalBookingHour) {
			newBookingTime = addMinutes(newBookingTime, 15);

			bookingTimes.push(newBookingTime);
		}
	}

	useEffect(() => {
		console.log("Selected Date:\n\t", selectedDate);
	}, [selectedDate]);

	useEffect(() => {
		console.log("Selected Time:\n\t", selectedTime);
	}, [selectedTime]);

	const handleCheck = async () => {
		if (!selectedTime) {
			console.log("No time selected");
			return;
		}

		try {
			const bookingTime = selectedTime.toISOString();

			console.log(bookingTime);

			const response = await fetch("/api/machines/check-availability/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					bookingTime: bookingTime,
				}),
			});

			const data = await response.json();

			console.log(data);
			setAvailableMachines(data.availableMachines);
		} catch (error) {
			console.error(error);
		}
	};

	const handleBook = async (machineUuid: string) => {
		if (!selectedTime) {
			console.log("No time selected");
			return;
		}

		try {
			const bookingTime = selectedTime.toISOString();

			const response = await fetch("/api/bookings/create/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					bookingTime: bookingTime,
					machineUuid: machineUuid,
				}),
			});

			const data = await response.json();

			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<p>Book Session</p>
			<div>
				{bookingDates.map((date, index) => (
					<button key={index} onClick={() => setSelectedDate(date)}>
						{format(date, "EEEE, MMMM dd, yyyy")}
					</button>
				))}
			</div>
			<div>
				{bookingTimes
					.filter((time) => isSameDay(time, selectedDate))
					.map((time, index) => (
						<button key={index} onClick={() => setSelectedTime(time)}>
							{format(time, "h:mm a")}
						</button>
					))}
			</div>
			<button
				onClick={handleCheck}
				className="border-1 p-4 cursor-pointer w-full"
				disabled={!selectedTime}
			>
				Check Available Machines
			</button>
			{availableMachines.Machines.length > 0 && (
				<div>
					<p>Available Machines:</p>
					<ul>
						{availableMachines.Machines.map((machine, index) => (
							<button key={index} onClick={() => handleBook(machine.Uuid)}>
								Book {machine.Name}
							</button>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
