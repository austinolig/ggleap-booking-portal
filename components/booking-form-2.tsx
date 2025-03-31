"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMinutes,
  format,
  getHours,
  isSameDay,
  set,
  isBefore,
  isAfter,
} from "date-fns";
import { Booking, Machine } from "@/types"; // Assuming types are defined correctly
import { LoaderCircle } from "lucide-react";

type TimeSlot = {
  date: Date;
  availableMachines: number;
};

type BookedInterval = {
  start: Date;
  end: Date;
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
const timeSlotIncrementMinutes = 15;

function intervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return isBefore(startA, endB) && isAfter(endA, startB);
}

export default function BookingForm2() {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDuration, setSelectedDuration] = useState<number>(90);

  const bookedIntervalsByMachine = useMemo(() => {
    const map = new Map<string, BookedInterval[]>();

    for (const booking of bookings) {
      const bookingStart = new Date(booking.Start);
      const bookingMachine = booking.Machines[0];

      // Use booking.Duration, fallback to selected selectedDuration if missing/invalid
      const bookingselectedDurationMinutes =
        booking.Duration && booking.Duration > 0
          ? booking.Duration
          : selectedDuration;
      const bookingEnd = addMinutes(
        bookingStart,
        bookingselectedDurationMinutes
      );

      if (!map.has(bookingMachine)) {
        map.set(bookingMachine, []);
      }

      map.get(bookingMachine)?.push({ start: bookingStart, end: bookingEnd });
    }

    return map;
  }, [bookings, selectedDuration]);

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
      const dayToProcess = addDays(firstTimeSlotDate, i);
      bookingDates.push(dayToProcess);

      let currentTimeSlot = dayToProcess;

      const currentTimeSlotStart = currentTimeSlot;

      const currentTimeSlotEnd = addMinutes(
        currentTimeSlotStart,
        selectedDuration
      );

      let availableMachineCount = 0;
      for (const machine of allMachines) {
        const machineBookedIntervals = bookedIntervalsByMachine.get(
          machine.Uuid
        );

        if (!machineBookedIntervals) {
          continue;
        }

        let isMachineAvailableForSlot = true;

        for (const bookedInterval of machineBookedIntervals) {
          if (
            intervalsOverlap(
              currentTimeSlotStart,
              currentTimeSlotEnd,
              bookedInterval.start,
              bookedInterval.end
            )
          ) {
            isMachineAvailableForSlot = false;
            break;
          }
        }

        if (isMachineAvailableForSlot) {
          availableMachineCount++;
        }
      }

      timeSlots.push({
        date: currentTimeSlotStart,
        availableMachines: availableMachineCount,
      });

      while (getHours(currentTimeSlot) < lastHour) {
        currentTimeSlot = addMinutes(currentTimeSlot, timeSlotIncrementMinutes);

        const currentTimeSlotStart = currentTimeSlot;

        const currentTimeSlotEnd = addMinutes(
          currentTimeSlotStart,
          selectedDuration
        );

        let availableMachineCount = 0;
        for (const machine of allMachines) {
          const machineBookedIntervals = bookedIntervalsByMachine.get(
            machine.Uuid
          );

          if (!machineBookedIntervals) {
            continue;
          }

          let isMachineAvailableForSlot = true;

          for (const bookedInterval of machineBookedIntervals) {
            if (
              intervalsOverlap(
                currentTimeSlotStart,
                currentTimeSlotEnd,
                bookedInterval.start,
                bookedInterval.end
              )
            ) {
              isMachineAvailableForSlot = false;
              break;
            }
          }

          if (isMachineAvailableForSlot) {
            availableMachineCount++;
          }
        }

        timeSlots.push({
          date: currentTimeSlotStart,
          availableMachines: availableMachineCount,
        });
      }
    }

    return { bookingDates, timeSlots };
  }, [selectedDuration, bookedIntervalsByMachine]);

  const [selectedTimeSlotDate, setSelectedTimeSlotDate] = useState<Date>(() => {
    const firstAvailableSlot = timeSlots.find(
      (timeSlot) => timeSlot.availableMachines > 0
    );

    return firstAvailableSlot ? firstAvailableSlot.date : timeSlots[0].date;
  });

  useEffect(() => {
    const firstSlotOnSelectedDate = timeSlots.find(
      (timeSlot) =>
        isSameDay(timeSlot.date, selectedDate) && timeSlot.availableMachines > 0
    );
    setSelectedTimeSlotDate(
      firstSlotOnSelectedDate ? firstSlotOnSelectedDate.date : timeSlots[0].date
    );
  }, [timeSlots, selectedDate]); // Rerun when timeslots or selectedDate change

  const filteredTimeSlots = useMemo(() => {
    return timeSlots.filter((timeSlot) =>
      isSameDay(timeSlot.date, selectedDate)
    );
  }, [timeSlots, selectedDate]);

  const machinesOnSelectedDate = useMemo(() => {
    const selectedSlotStart = selectedTimeSlotDate;
    const selectedSlotEnd = addMinutes(selectedSlotStart, selectedDuration);

    return allMachines.map((machine) => {
      const machineBookedIntervals = bookedIntervalsByMachine.get(machine.Uuid);

      let isAvailable = true;

      if (machineBookedIntervals) {
        isAvailable = !machineBookedIntervals.some((bookedInterval) =>
          intervalsOverlap(
            selectedSlotStart,
            selectedSlotEnd,
            bookedInterval.start,
            bookedInterval.end
          )
        );
      }

      return {
        ...machine,
        isAvailable: isAvailable,
      };
    });
  }, [selectedTimeSlotDate, selectedDuration, bookedIntervalsByMachine]);

  function changeSelectedDate(date: Date) {
    const newSelectedDate = set(date, {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    setSelectedDate(newSelectedDate);

    const firstSlotOnNewDate = timeSlots.find((timeSlot) =>
      isSameDay(timeSlot.date, newSelectedDate)
    );

    if (!firstSlotOnNewDate) {
      return;
    }

    setSelectedTimeSlotDate(firstSlotOnNewDate.date);
  }

  useEffect(() => {
    const getBookings = async () => {
      setLoading(true);
      try {
        const bookingDate = currentDate.toISOString();
        const response = await fetch("/api/bookings/get-bookings/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingDate: bookingDate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(
            "Failed to fetch bookings:",
            response.status,
            errorData
          );
          setBookings([]);
          return;
        }

        const data = await response.json();
        if (!data.bookings) {
          console.warn("No 'bookings' array found in API response:", data);
          setBookings([]);
          return;
        }
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-bold mb-2">Date</p>
        <div className="grid grid-cols-2 gap-2">
          {bookingDates.map((date, index) => (
            <button
              key={index}
              className={`p-2 border rounded cursor-pointer  ${
                isSameDay(selectedDate, date)
                  ? "text-blue-500"
                  : "hover:text-blue-200"
              }`}
              onClick={() => changeSelectedDate(date)}
            >
              {format(date, "EEE, MMM dd, yyyy")}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="font-bold mb-2">Duration</p>
        <div className="grid grid-cols-2 gap-2">
          {[90, 60].map((duration) => (
            <button
              key={duration}
              className={`p-2 border rounded cursor-pointer ${
                selectedDuration === duration
                  ? "text-blue-500"
                  : "hover:text-blue-200"
              }`}
              onClick={() => setSelectedDuration(duration)}
            >
              {duration} mins
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="font-bold mb-2">Time</p>
        {filteredTimeSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {filteredTimeSlots.map((timeSlot) => (
              <button
                key={timeSlot.date.toISOString()}
                className={`p-2 border rounded cursor-pointer ${
                  selectedTimeSlotDate?.getTime() === timeSlot.date.getTime()
                    ? "text-blue-500"
                    : timeSlot.availableMachines > 0
                    ? "text-white hover:text-blue-200"
                    : "text-muted border-muted cursor-not-allowed"
                }`}
                disabled={timeSlot.availableMachines === 0}
                onClick={() => setSelectedTimeSlotDate(timeSlot.date)}
              >
                {format(timeSlot.date, "h:mm a")}
                <br />({timeSlot.availableMachines} PCs)
              </button>
            ))}
          </div>
        ) : (
          <p>No available time slots for this date and duration.</p>
        )}
      </div>
      <div>
        <p className="font-bold mb-2">PCs</p>
        {selectedTimeSlotDate && !isNaN(selectedTimeSlotDate.getTime()) ? (
          <div className="grid grid-cols-2 gap-2">
            {machinesOnSelectedDate.map((machine) => (
              <button
                key={machine.Uuid}
                className={`p-2 border rounded cursor-pointer ${
                  machine.isAvailable
                    ? "text-white hover:text-blue-200"
                    : "text-muted border-muted cursor-not-allowed"
                }`}
                disabled={!machine.isAvailable}
                onClick={() =>
                  alert(
                    `Simulate Booking ${machine.Name} for: ${format(
                      selectedTimeSlotDate,
                      "MMM dd, yyyy 'at' h:mm a"
                    )} for ${selectedDuration} mins`
                  )
                }
              >
                {machine.Name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Please select a valid time slot to see available machines.
          </p>
        )}
      </div>
    </div>
  );
}
