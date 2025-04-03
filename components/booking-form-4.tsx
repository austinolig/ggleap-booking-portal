"use client";

import { useSelectedStore } from "@/stores";
import { Booking, CenterHours, Machine } from "@/types";
import {
  addDays,
  addMinutes,
  format,
  getHours,
  getMinutes,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  set,
  setMinutes,
} from "date-fns";
import { useMemo } from "react";

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

const currentDate = new Date();
const dates = [currentDate, addDays(currentDate, 1)];
const durations = [90, 60];

const hasOverlap = (potentialBooking: Booking, existingBooking: Booking) => {
  const potentialStart = new Date(potentialBooking.Start);
  const potentialEnd = addMinutes(potentialStart, potentialBooking.Duration);
  const existingStart = new Date(existingBooking.Start);
  const existingEnd = addMinutes(existingStart, existingBooking.Duration);

  return (
    isBefore(potentialStart, existingEnd) &&
    isAfter(potentialEnd, existingStart)
  );
};

export default function BookingForm4({
  bookings,
  centerHours,
}: {
  bookings: Booking[];
  centerHours: CenterHours;
}) {
  const selectedTime = useSelectedStore((state) => state.selectedTime);
  const selectedDate = useSelectedStore((state) => state.selectedDate);
  const selectedDuration = useSelectedStore((state) => state.selectedDuration);

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

  const machinesAndBookings = useMemo(() => {
    const machinesAndBookings: Map<string, Booking[]> = new Map();

    bookings.forEach((booking) => {
      const startTime = new Date(booking.Start);
      const machineUuid = booking.Machines[0];

      if (!machinesAndBookings.has(machineUuid)) {
        machinesAndBookings.set(machineUuid, []);
      }

      const newBooking: Booking = {
        Start: startTime.toISOString(),
        Duration: booking.Duration,
        Machines: [machineUuid],
      };

      machinesAndBookings.get(machineUuid)?.push(newBooking);
    });

    return machinesAndBookings;
  }, [bookings]);

  const processedTimes = useMemo(() => {
    const specialHours =
      centerHours.Special[selectedDate.toISOString().split("T")[0]];

    let specialOpenDate: Date;
    let specialCloseDate: Date;

    if (specialHours) {
      const specialOpen = specialHours[0].Open.split(":");
      const specialClose = specialHours[0].Close.split(":");

      specialOpenDate = set(selectedDate, {
        hours: parseInt(specialOpen[0]),
        minutes: parseInt(specialOpen[1]),
        seconds: 0,
        milliseconds: 0,
      });

      specialCloseDate = set(selectedDate, {
        hours: parseInt(specialClose[0]) - 1,
        minutes: parseInt(specialClose[1]),
        seconds: 0,
        milliseconds: 0,
      });
    }

    return times.map((time) => {
      let availableMachines = 0;

      const timeToProcess = set(selectedDate, {
        hours: getHours(time),
        minutes: getMinutes(time),
        seconds: 0,
        milliseconds: 0,
      });

      // handle duration change
      if (
        specialHours &&
        (isAfter(timeToProcess, specialCloseDate) ||
          isBefore(timeToProcess, specialOpenDate))
      ) {
        console.log("__OVERLAP DETECTED__");
        console.log("timetoprocess:", timeToProcess);
        console.log("special hours:", specialOpenDate, specialCloseDate);

        return {
          time,
          availableMachines: 0,
        };
      }

      for (const machine of allMachines) {
        const machineBookings = machinesAndBookings.get(machine.Uuid);

        if (!machineBookings) {
          continue;
        }

        const potentialBooking = {
          Start: timeToProcess.toISOString(),
          Duration: selectedDuration,
          Machines: [""],
        };

        let isMachineAvailableForSlot = true;
        for (const booking of machineBookings) {
          if (hasOverlap(potentialBooking, booking)) {
            isMachineAvailableForSlot = false;
            break;
          }
        }

        if (isMachineAvailableForSlot) {
          availableMachines++;
        }
      }

      return {
        time,
        availableMachines: availableMachines,
      };
    });
  }, [
    machinesAndBookings,
    selectedDate,
    selectedDuration,
    times,
    centerHours.Special,
  ]);

  const processedMachines = useMemo(() => {
    return allMachines.map((machine) => {
      const timeToProcess = set(selectedDate, {
        hours: getHours(selectedTime),
        minutes: getMinutes(selectedTime),
        seconds: 0,
        milliseconds: 0,
      });

      const potentialBooking = {
        Start: timeToProcess.toISOString(),
        Duration: selectedDuration,
        Machines: [""],
      };

      let isMachineAvailableForSlot = true;

      const machineBookings = machinesAndBookings.get(machine.Uuid);

      if (machineBookings) {
        isMachineAvailableForSlot = !machineBookings.some((booking) =>
          hasOverlap(potentialBooking, booking)
        );
      }

      return {
        machine,
        isAvailable: isMachineAvailableForSlot,
      };
    });
  }, [selectedDate, selectedTime, selectedDuration, machinesAndBookings]);

  return (
    <div className="space-y-4">
      <DateSelector />
      <DurationSelector />
      <TimeSelector processedTimes={processedTimes} />
      <MachineSelector processedMachines={processedMachines} />
    </div>
  );
}

const DateSelector = () => {
  const selectedDate = useSelectedStore((state) => state.selectedDate);
  const setSelectedDate = useSelectedStore((state) => state.setSelectedDate);

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

const TimeSelector = ({
  processedTimes,
}: {
  processedTimes: {
    time: Date;
    availableMachines: number;
  }[];
}) => {
  const selectedTime = useSelectedStore((state) => state.selectedTime);
  const setSelectedTime = useSelectedStore((state) => state.setSelectedTime);

  return (
    <div>
      <p className="font-bold">Select Time</p>
      <div className="flex flex-col items-start">
        {processedTimes.map(({ time, availableMachines }) => (
          <button
            key={time.toISOString()}
            className={`${isEqual(selectedTime, time) ? "text-blue-500" : ""}`}
            onClick={() => setSelectedTime(time)}
          >
            {format(time, "h:mm a")} ({availableMachines} available)
          </button>
        ))}
      </div>
    </div>
  );
};

const DurationSelector = () => {
  const selectedDuration = useSelectedStore((state) => state.selectedDuration);
  const setSelectedDuration = useSelectedStore(
    (state) => state.setSelectedDuration
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

const MachineSelector = ({
  processedMachines,
}: {
  processedMachines: {
    machine: Machine;
    isAvailable: boolean;
  }[];
}) => {
  const bookPC = useSelectedStore((state) => state.bookPC);

  return (
    <div>
      <p className="font-bold">Select Machine</p>
      <div className="flex flex-col items-start">
        {processedMachines.map(({ machine, isAvailable }) => (
          <button
            key={machine.Uuid}
            className={
              isAvailable
                ? "text-green-500 hover:text-blue-500"
                : "text-red-500"
            }
            onClick={() => bookPC(machine)}
          >
            {machine.Name}
          </button>
        ))}
      </div>
    </div>
  );
};
