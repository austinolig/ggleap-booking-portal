"use client";

import { useSelectedStore } from "@/stores";
import { Machine } from "@/types";
import { addDays, format, isEqual, isSameDay, set, setMinutes } from "date-fns";
import { memo } from "react";
import { useShallow } from "zustand/shallow";

const allMachines = [
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

// const processedMachines = allMachines.map((machine) => ({
//   ...machine,
//   existingBookings: [],
// }));

const currentDate = new Date("March 27, 2025");
const dates = [currentDate, addDays(currentDate, 1)];
const durations = [90, 60];

const calculateTimes = () => {
  const startHour = 10;
  const endHour = 15;
  const minuteInterval = 15;

  const times: Date[] = [];

  let firstTime = set(currentDate, {
    hours: startHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  times.push(firstTime);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 15; minute <= 60; minute += minuteInterval) {
      firstTime = setMinutes(firstTime, minute);
      times.push(firstTime);
    }
  }

  return times;
};

const times = calculateTimes();

export default function BookingForm4() {
  return (
    <div className="space-y-4">
      <DateSelector />
      <TimeSelector />
      <DurationSelector />
      <MachineSelector />
    </div>
  );
}

const DateSelector = () => {
  const { selectedDate, setSelectedDate } = useSelectedStore(
    useShallow((state) => ({
      selectedDate: state.selectedDate,
      setSelectedDate: state.setSelectedDate,
    }))
  );

  return (
    <div>
      <p className="font-bold">Select Date</p>
      <div className="flex flex-col items-start">
        {dates.map((date, index) => (
          <button
            key={index}
            className={`${
              isSameDay(selectedDate, date) ? "text-blue-500" : ""
            }`}
            onClick={() => setSelectedDate(date)}
          >
            {format(date, "EEE, MMM dd, yyyy")}
          </button>
        ))}
      </div>
    </div>
  );
};

const TimeSelector = () => {
  const { selectedTime, setSelectedTime } = useSelectedStore(
    useShallow((state) => ({
      selectedTime: state.selectedTime,
      setSelectedTime: state.setSelectedTime,
    }))
  );

  return (
    <div>
      <p className="font-bold">Select Time</p>
      <div className="flex flex-col items-start">
        {times.map((time) => (
          <button
            key={time.toISOString()}
            className={`${isEqual(selectedTime, time) ? "text-blue-500" : ""}`}
            onClick={() => setSelectedTime(time)}
          >
            {format(time, "h:mm a")}
          </button>
        ))}
      </div>
    </div>
  );
};

const DurationSelector = () => {
  const { selectedDuration, setSelectedDuration } = useSelectedStore(
    useShallow((state) => ({
      selectedDuration: state.selectedDuration,
      setSelectedDuration: state.setSelectedDuration,
    }))
  );

  return (
    <div>
      <p className="font-bold">Select Duration</p>
      <div className="flex flex-col items-start">
        {durations.map((duration) => (
          <button
            key={duration}
            className={`${
              duration === selectedDuration ? "text-blue-500" : ""
            }`}
            onClick={() => setSelectedDuration(duration)}
          >
            {duration} minutes
          </button>
        ))}
      </div>
    </div>
  );
};

const MachineSelector = memo(function MachineSelector() {
  const { selectedDate, selectedTime, selectedDuration } = useSelectedStore(
    useShallow((state) => ({
      selectedDate: state.selectedDate,
      selectedTime: state.selectedTime,
      selectedDuration: state.selectedDuration,
    }))
  );

  const bookPC = (machine: Machine) => {
    console.log("Book PC:", machine.Name);
    console.log("Selected Date:", format(selectedDate, "EEE, MMM dd, yyyy"));
    console.log("Selected Time:", format(selectedTime, "h:mm a"));
    console.log("Selected Duration:", selectedDuration, "minutes");
  };

  return (
    <div>
      <p className="font-bold">Select Machine</p>
      <div className="flex flex-col items-start">
        {allMachines.map((machine) => (
          <button
            key={machine.Uuid}
            className={"hover:text-blue-500"}
            onClick={() => bookPC(machine)}
          >
            {machine.Name}
          </button>
        ))}
      </div>
    </div>
  );
});
