"use client";

import { useState } from "react";

export default function CreateBooking() {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const dateToday = new Date();
  const dateTomorrow = new Date();
  dateTomorrow.setDate(dateTomorrow.getDate() + 1);

  const availableDates = [dateToday, dateTomorrow];

  const availableTimes = [
    "10:00 AM",
    "10:15 AM",
    "10:30 AM",
    "10:45 AM",
    "11:00 AM",
    "11:15 AM",
    "11:30 AM",
    "11:45 AM",
    "12:00 PM",
    "12:15 PM",
    "12:30 PM",
    "12:45 PM",
    "1:00 PM",
    "1:15 PM",
    "1:30 PM",
    "1:45 PM",
    "2:00 PM",
    "2:15 PM",
    "2:30 PM",
    "2:45 PM",
    "3:00 PM",
  ];

  console.log(availableDates);

  const handleClick = async () => {
    try {
      const start = new Date(`${bookingDate}, ${bookingTime}`).toISOString();

      console.log(start);

      const response = await fetch("/api/bookings/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: start,
        }),
      });

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 border-1">
      <p className="font-bold">Create Booking</p>

      <div className="border-1 p-4 flex gap-4">
        <label htmlFor="date">Date:</label>
        <select
          id="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          required
          className="border-1"
        >
          {availableDates.map((date) => (
            <option key={date.toISOString()} value={date.toDateString()}>
              {date.toDateString()}
            </option>
          ))}
        </select>
      </div>
      <div className="border-1 p-4 flex gap-4">
        <label htmlFor="time">Time:</label>
        <select
          id="time"
          value={bookingTime}
          onChange={(e) => setBookingTime(e.target.value)}
          required
          className="border-1"
        >
          {availableTimes
            .filter(
              (time) =>
                (bookingDate === dateToday.toDateString() &&
                  time > dateToday.toISOString().split("T")[1]) ||
                bookingDate === dateTomorrow.toDateString()
            )
            .map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>
      </div>
      <button
        onClick={handleClick}
        className="border-1 p-4 cursor-pointer w-full"
      >
        Create booking
      </button>
    </div>
  );
}
