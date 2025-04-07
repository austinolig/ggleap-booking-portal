"use client";

import { useSelectionStore } from "@/stores";
import { addDays, format, isSameDay, set } from "date-fns";

export default function DateSelect() {
  const selectedDate = useSelectionStore((state) => state.selectedDate);
  const setSelectedDate = useSelectionStore((state) => state.setSelectedDate);

  const initialDate = set(new Date(), {
    hours: 10,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const dates = [initialDate, addDays(initialDate, 1)];

  return (
    <div>
      {dates.map((date) => (
        <button
          key={date.toISOString()}
          className={isSameDay(selectedDate, date) ? "text-blue-500" : ""}
          onClick={() => setSelectedDate(date.toISOString())}
        >
          {format(date, "MMM dd, yyyy")}
        </button>
      ))}
    </div>
  );
}
