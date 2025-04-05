"use client";

import { useDataStore, useSelectedStore } from "@/stores";
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
  const selectedTime = useSelectedStore((state) => state.selectedTime);
  const setSelectedTime = useSelectedStore((state) => state.setSelectedTime);
  const times = useDataStore((state) => state.times);
  // initialize available times between center (special) hours with 15 mininute intervals
  // generate available machines based on existing bookings

  // console.log("occupiedMachinesByTime", occupiedMachinesByTime);

  // console.log("times", times);
  // console.log("selectedTime", selectedTime);

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
