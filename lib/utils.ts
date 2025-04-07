import { clsx, type ClassValue } from "clsx";
import { addMinutes, format, isAfter, isBefore, set } from "date-fns";
import { twMerge } from "tailwind-merge";
import { Booking, CenterInfo, TimeAndAvailableMachines } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTimesAndMachines(
  centerInfo: CenterInfo,
  selectedDate: Date,
  selectedDuration: number
):
  | {
      time: Date;
      machineList: Map<string, { name: string; available: boolean }>;
    }[]
  | null {
  const { hours, bookings, machines } = centerInfo;

  if (!hours || !bookings || !machines) {
    return null;
  }

  const dayOfWeek = format(selectedDate, "EEEE");
  const dateString = format(selectedDate, "yyyy-MM-dd");

  // check if center is open on selected date
  if (!hours.Regular[dayOfWeek][0]?.Open) {
    return null;
  }

  const regularHours = {
    openTime: hours.Regular[dayOfWeek][0].Open,
    closeTime: hours.Regular[dayOfWeek][0].Close,
  };

  const [regularOpenHour, regularOpenMinute] = regularHours.openTime.split(":");
  const [regularCloseHour, regularCloseMinute] =
    regularHours.closeTime.split(":");

  const regularStartTime = set(selectedDate, {
    hours: parseInt(regularOpenHour),
    minutes: parseInt(regularOpenMinute),
    seconds: 0,
    milliseconds: 0,
  });

  const regularEndTime = set(selectedDate, {
    hours: parseInt(regularCloseHour),
    minutes: parseInt(regularCloseMinute) - 60, // subtract shortest possible duration (60) from closing time
    seconds: 0,
    milliseconds: 0,
  });

  let specialHours = regularHours;
  if (hours.Special[dateString]) {
    specialHours = {
      openTime: hours.Special[dateString][0].Open,
      closeTime: hours.Special[dateString][0].Close,
    };
  }
  const [specialOpenHour, specialOpenMinute] = specialHours.openTime.split(":");
  const [specialCloseHour, specialCloseMinute] =
    specialHours.closeTime.split(":");

  const specialStartTime = set(selectedDate, {
    hours: parseInt(specialOpenHour),
    minutes: parseInt(specialOpenMinute),
    seconds: 0,
    milliseconds: 0,
  });

  const specialEndTime = set(selectedDate, {
    hours: parseInt(specialCloseHour),
    minutes: parseInt(specialCloseMinute) - selectedDuration,
    seconds: 0,
    milliseconds: 0,
  });

  const times = [];
  const slotInterval = 15; // minutes
  const totalMachines = machines.length;

  let slotStartTime = regularStartTime;
  const slotEndTime = addMinutes(slotStartTime, selectedDuration);

  const map = new Map<string, Set<string>>();

  const totalOccupiedMachines = getTotalOccupiedMachines(
    slotStartTime,
    slotEndTime,
    specialStartTime,
    specialEndTime,
    bookings
    // totalMachines
  );

  const machineList = new Map<string, { name: string; available: boolean }>();

  centerInfo.machines.forEach((machine) => {
    machineList.set(machine.Uuid, {
      name: machine.Name,
      available: !totalOccupiedMachines.has(machine.Uuid),
    });
  });

  map.set(slotStartTime.toISOString(), totalOccupiedMachines);

  times.push({
    time: slotStartTime,
    machineList: machineList,
  });

  while (isBefore(slotStartTime, regularEndTime)) {
    slotStartTime = addMinutes(slotStartTime, slotInterval);
    const slotEndTime = addMinutes(slotStartTime, selectedDuration);

    const totalOccupiedMachines = getTotalOccupiedMachines(
      slotStartTime,
      slotEndTime,
      specialStartTime,
      specialEndTime,
      bookings
      //   totalMachines
    );

    const machineList = new Map<string, { name: string; available: boolean }>();

    centerInfo.machines.forEach((machine) => {
      machineList.set(machine.Uuid, {
        name: machine.Name,
        available: !totalOccupiedMachines.has(machine.Uuid),
      });
    });

    map.set(slotStartTime.toISOString(), totalOccupiedMachines);

    times.push({
      time: slotStartTime,
      machineList: machineList,
    });
  }

  return times;
}

function getTotalOccupiedMachines(
  slotStartTime: Date,
  slotEndTime: Date,
  specialStartTime: Date,
  specialEndTime: Date,
  bookings: Booking[]
  //   totalMachines: number
): Set<string> {
  //   let totalOccupiedMachines = 0;

  const occupiedMachines = new Set<string>();

  if (
    isBefore(slotStartTime, specialStartTime) ||
    isAfter(slotStartTime, specialEndTime)
  ) {
    // totalOccupiedMachines = totalMachines;
  } else {
    for (const booking of bookings) {
      const bookingStartTime = new Date(booking.Start);
      const bookingEndTime = addMinutes(bookingStartTime, booking.Duration);

      if (
        isBefore(slotStartTime, bookingEndTime) &&
        isAfter(slotEndTime, bookingStartTime)
      ) {
        occupiedMachines.add(booking.Machines[0]);
      }
    }
  }

  return occupiedMachines;
}
