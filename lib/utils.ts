import { clsx, type ClassValue } from "clsx";
import { format, addMinutes, subMinutes, isAfter, isBefore } from "date-fns";
import { twMerge } from "tailwind-merge";
import { CenterInfo, Machine, TimeSlot } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvailableTimeSlots(
  centerInfo: CenterInfo,
  selectedDate: Date,
  selectedDuration: number,
): TimeSlot[] {
  // keys for accessing regular and special hours
  const dayOfWeek = format(selectedDate, "EEEE");
  const dateString = format(selectedDate, "yyyy-MM-dd");

  // ensure center is open on selected date
  if (
    !centerInfo.hours.Regular[dayOfWeek][0]?.Open &&
    !centerInfo.hours.Special[dateString]
  ) {
    console.log("Center is closed on selected date");
    return [];
  }

  const gracePeriod = 60;

  let openDate: Date;
  let closeDate: Date;

  // // initialize hours
  if (centerInfo.hours.Special[dateString]) {
    openDate = new Date(
      `${dateString} ${centerInfo.hours.Special[dateString][0].Open}`,
    );
    closeDate = subMinutes(
      new Date(
        `${dateString} ${centerInfo.hours.Special[dateString][0].Close}`,
      ),
      gracePeriod,
    ); // subtract grace period from special closing time
  } else {
    openDate = new Date(
      `${dateString} ${centerInfo.hours.Regular[dayOfWeek][0].Open}`,
    );
    closeDate = subMinutes(
      new Date(`${dateString} ${centerInfo.hours.Regular[dayOfWeek][0].Close}`),
      gracePeriod,
    ); // subtract grace period from regular closing time
  }

  const graceClose = addMinutes(closeDate, gracePeriod);
  let timeSlotStart = openDate;

  const timeSlots: TimeSlot[] = [];
  while (timeSlotStart.getTime() <= closeDate.getTime()) {
    const timeSlotEnd = addMinutes(timeSlotStart, selectedDuration);

    let availablePCs = 0;
    // time slot is valid if:
    //  not outside of operating hours
    //  not exceed grace period
    //  not in the past
    if (
      !(
        isBefore(timeSlotStart, openDate) ||
        isAfter(timeSlotStart, closeDate) ||
        isAfter(timeSlotEnd, graceClose) ||
        isBefore(timeSlotStart, new Date())
      )
    ) {
      const occupiedMachines = new Set<string>();
      for (const booking of centerInfo.bookings) {
        const bookingStart = new Date(booking.Start);
        const bookingEnd = addMinutes(bookingStart, booking.Duration);

        // if time slot overlaps with booking time, add machine to occupied set
        if (
          isBefore(timeSlotStart, bookingEnd) &&
          isAfter(timeSlotEnd, bookingStart)
        ) {
          occupiedMachines.add(booking.Machines[0]);
        }
      }
      availablePCs = centerInfo.machines.length - occupiedMachines.size;
    }

    timeSlots.push({
      time: timeSlotStart,
      availablePCs: availablePCs,
    });

    timeSlotStart = addMinutes(timeSlotStart, 15); // 15 minute intervals
  }

  return timeSlots;
}

export function getAvailableMachines(
  centerInfo: CenterInfo,
  selectedTime: Date | null,
  selectedDuration: number,
): Machine[] {
  if (!selectedTime) {
    return [];
  }

  let machines: Machine[] = [];
  const occupiedMachines = new Set<string>();

  const timeSlotStart = selectedTime;
  const timeSlotEnd = addMinutes(timeSlotStart, selectedDuration);

  for (const booking of centerInfo.bookings) {
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

  machines = centerInfo.machines.map((machine) => ({
    ...machine,
    Available: !occupiedMachines.has(machine.Uuid),
  }));

  return machines;
}
