import { clsx, type ClassValue } from "clsx";
import { format, addMinutes, subMinutes, isAfter, isBefore } from "date-fns";
import { twMerge } from "tailwind-merge";
import { CenterInfo, Machine, ProcessedTimeSlots } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTimeSlots(
  centerInfo: CenterInfo,
  selectedDate: string,
  selectedDuration: number
): ProcessedTimeSlots | null {
  const { hours, bookings, machines } = centerInfo;

  // keys for accessing regular and special hours
  const dayOfWeek = format(selectedDate, "EEEE");
  const dateString = format(selectedDate, "yyyy-MM-dd");

  // ensure center is open on selected date
  // if (!hours.Regular[dayOfWeek][0]?.Open) {
  //   return null;
  // }

  // set regular hours
  // const regularOpen = new Date(
  //   `${dateString} ${hours.Regular[dayOfWeek][0].Open}`
  // );

  // const regularClose = subMinutes(
  //   new Date(`${dateString} ${hours.Regular[dayOfWeek][0].Close}`),
  //   60
  // ); // subtract shortest duration from regular closing time

  const regularOpen = new Date(`${dateString} 10:00`);
  const regularClose = subMinutes(new Date(`${dateString} 16:00`), 60); // subtract shortest duration from regular closing time

  // set special hours if available
  let specialOpen = regularOpen;
  let specialClose = regularClose;
  if (hours.Special[dateString]) {
    specialOpen = new Date(
      `${dateString} ${hours.Special[dateString][0].Open}`
    );
    specialClose = subMinutes(
      new Date(`${dateString} ${hours.Special[dateString][0].Close}`),
      selectedDuration
    ); // subtract selected duration from special closing time
  }

  // process time slots from regular open to regular close
  const processedTimeSlots: ProcessedTimeSlots = {};
  const slotInterval = 15; // minutes

  let timeSlotStart = regularOpen;
  while (timeSlotStart.getTime() <= regularClose.getTime()) {
    const timeSlotEnd = addMinutes(timeSlotStart, selectedDuration);

    let availableMachinesCount = 0;
    let machineList: Machine[] = machines;
    const occupiedMachines = new Set<string>();

    // if time slot is not outside of special hours
    if (
      !(
        isBefore(timeSlotStart, specialOpen) ||
        isAfter(timeSlotStart, specialClose)
      )
    ) {
      for (const booking of bookings) {
        const bookingStart = new Date(booking.Start);
        const bookingEnd = addMinutes(bookingStart, booking.Duration);

        // if time slot overlaps with booking time
        if (
          isBefore(timeSlotStart, bookingEnd) &&
          isAfter(timeSlotEnd, bookingStart)
        ) {
          occupiedMachines.add(booking.Machines[0]);
        }
      }
      availableMachinesCount = machines.length - occupiedMachines.size;
      machineList = machines.map((machine) => ({
        ...machine,
        Available: !occupiedMachines.has(machine.Uuid),
      }));
    }

    processedTimeSlots[timeSlotStart.toISOString()] = {
      availableMachinesCount: availableMachinesCount,
      machineList: machineList,
    };

    timeSlotStart = addMinutes(timeSlotStart, slotInterval);
  }

  return processedTimeSlots;
}
