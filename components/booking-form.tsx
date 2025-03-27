"use client";

import { useEffect, useState } from "react";
import {
  addDays,
  addMinutes,
  compareAsc,
  format,
  getHours,
  isSameDay,
  set,
} from "date-fns";
import { MachinesResponse } from "@/lib/types/ggLeap";

export default function BookingForm() {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [availableMachines, setAvailableMachines] = useState<MachinesResponse>({
    Machines: [],
  });

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
    try {
      const bookingDateTime = dateTime.toISOString();

      console.log(bookingDateTime);

      const response = await fetch("/api/machines/check-availability/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingTime: bookingDateTime,
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
    return null;

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
      <br />
      <div>
        {allBookingDates.map((date, index) => (
          <button key={index} onClick={() => setSelectedDate(date)}>
            {format(date, "EEEE, MMMM dd, yyyy")}
          </button>
        ))}
      </div>
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
              // onClick={() => setSelectedDateTime(dateTime)}
              onClick={() => checkAvailabilty(dateTime)}
            >
              {format(dateTime, "h:mm a")}
            </button>
          ))}
      </div>
      {/* <button
				onClick={handleCheck}
				className="border-1 p-4 cursor-pointer w-full"
				disabled={!selectedTime}
			>
				Check Available Machines
			</button>
			 */}
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
