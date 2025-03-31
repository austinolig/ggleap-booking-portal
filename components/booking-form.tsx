"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMinutes,
  format,
  getDate,
  getHours,
  isSameDay,
  set,
} from "date-fns";
import { Booking, Machine } from "@/types";
import { LoaderCircle } from "lucide-react";

type TimeSlot = {
  date: Date;
  availableMachines: number;
};

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

// BREAK UP COMPONENTS IN TO SEPARATE FILES (e.g. DateSelector, TimeSelector, MachineSelector)

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [duration, setDuration] = useState<number>(90);

  const { bookingDates, timeSlots } = useMemo(() => {
    const numberOfBookingDates = 2;
    const firstHour = 10;
    const lastHour = 15;

    const bookingDates: Date[] = [];
    const timeSlots: TimeSlot[] = [];

    const firstTimeSlotDate = set(currentDate, {
      hours: firstHour,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    for (let i = 0; i < numberOfBookingDates; i++) {
      const newTimeSlotDate = addDays(firstTimeSlotDate, i);

      bookingDates.push(newTimeSlotDate);

      let currentTimeSlot = newTimeSlotDate;

      while (getHours(currentTimeSlot) < lastHour) {
        const currentTimeSlotStart = currentTimeSlot;
        const currentTimeSlotEnd = addMinutes(currentTimeSlot, duration);

        const unavailableMachines: Set<string> = new Set();

        for (const booking of bookings) {
          const bookingStart = new Date(booking.Start);
          const bookingEnd = addMinutes(bookingStart, booking.Duration);

          if (
            (currentTimeSlotStart >= bookingStart &&
              currentTimeSlotStart < bookingEnd) ||
            (currentTimeSlotEnd > bookingStart &&
              currentTimeSlotEnd <= bookingEnd) ||
            (bookingStart >= currentTimeSlotStart &&
              bookingStart < currentTimeSlotEnd)
          ) {
            unavailableMachines.add(booking.Machines[0]);
          }
        }

        timeSlots.push({
          date: currentTimeSlot,
          availableMachines: allMachines.length - unavailableMachines.size,
        });

        currentTimeSlot = addMinutes(currentTimeSlot, 15);
      }
    }

    return { bookingDates, timeSlots };
  }, [bookings, duration]);

  const [selectedTimeSlotDate, setSelectedTimeSlotDate] = useState<Date>(
    timeSlots[0].date
  );

  const filteredTimeSlots = timeSlots.filter((timeSlot) =>
    isSameDay(timeSlot.date, selectedDate)
  );

  const machinesOnSelectedDate = allMachines.map((machine) => {
    const selectedTimeSlotStart = selectedTimeSlotDate;
    const selectedTimeSlotEnd = addMinutes(selectedTimeSlotDate, duration);

    const isAvailable = !bookings.some((booking) => {
      const bookingStart = new Date(booking.Start);
      const bookingEnd = addMinutes(bookingStart, booking.Duration);

      return (
        ((selectedTimeSlotStart >= bookingStart &&
          selectedTimeSlotStart < bookingEnd) ||
          (selectedTimeSlotEnd > bookingStart &&
            selectedTimeSlotEnd <= bookingEnd) ||
          (bookingStart >= selectedTimeSlotStart &&
            bookingStart < selectedTimeSlotEnd)) &&
        booking.Machines[0] === machine.Uuid
      );
    });

    return {
      ...machine,
      isAvailable: isAvailable,
    };
  });

  function changeSelectedDate(date: Date) {
    const newSelectedTimeSlotDate = set(selectedTimeSlotDate, {
      date: getDate(date),
    });

    setSelectedTimeSlotDate(newSelectedTimeSlotDate);
    setSelectedDate(date);
  }

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);

      const bookingDate = currentDate.toISOString();
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

      setBookings(data.bookings);
      setLoading(false);
    };

    getBookings();
  }, []);

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

  if (loading) {
    return (
      <div className="flex">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <p>Dates</p>
      <div className="grid grid-cols-2 gap-4">
        {bookingDates.map((date, index) => (
          <button
            key={index}
            className={
              selectedDate.getDate() === date.getDate() ? "text-blue-500" : ""
            }
            onClick={() => changeSelectedDate(date)}
          >
            {format(date, "EEEE, MMMM dd, yyyy")}
          </button>
        ))}
      </div>
      <br />
      <p>Duration</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          className={duration === 90 ? "text-blue-500" : ""}
          onClick={() => setDuration(90)}
        >
          90 mins
        </button>
        <button
          className={duration === 60 ? "text-blue-500" : ""}
          onClick={() => setDuration(60)}
        >
          60 mins
        </button>
      </div>
      <br />
      <p>Times</p>
      <div className="grid grid-cols-3 gap-2">
        {filteredTimeSlots.map((timeSlot, index) => (
          <button
            key={index}
            className={`${
              selectedTimeSlotDate.getTime() === timeSlot.date.getTime()
                ? "text-blue-500"
                : ""
            }
								${!timeSlot.availableMachines ? "text-muted" : ""}
								`}
            disabled={!timeSlot.availableMachines}
            onClick={() => setSelectedTimeSlotDate(timeSlot.date)}
          >
            {format(timeSlot.date, "h:mm a")}
            <br />({timeSlot.availableMachines} Available)
          </button>
        ))}
      </div>
      <br />
      <p>Machines</p>
      <div className="grid grid-cols-5 gap-2">
        {machinesOnSelectedDate.map((machine, index) => (
          <button
            key={index}
            className={!machine.isAvailable ? "text-muted" : ""}
            disabled={!machine.isAvailable}
            onClick={() =>
              alert(
                `Booked ${machine.Name}: ${format(
                  selectedTimeSlotDate,
                  "EEEE, MMM dd, yyyy 'at' h:mm a"
                )}`
              )
            }
          >
            {machine.Name}
          </button>
        ))}
      </div>
      {/* <br />
			<hr />
			<br />
			<div>
				<button
					onClick={async () => {
						const date = new Date("March 28, 2025 1:30 PM");
						const response = await fetch("/api/machines/check-availability/", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								bookingDateTime: date.toISOString(),
								duration: 60,
							}),
						});
						const data = await response.json();
						if (!data.availableMachines || !response.ok) {
							console.log("data:", data);
							return;
						}
						console.log("Available Machines:", data.availableMachines);
					}}
					className="p-4 bg-red-800 cursor-pointer hover:bg-red-950"
				>
					get booking
				</button>
			</div> */}
    </div>
  );
}
