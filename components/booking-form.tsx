import { getAllMachines } from "@/lib/api/ggLeap";
import DateSelect from "./date-select";

export default async function BookingForm() {
  // initialize all machines as Machine[]: fetch from ggLeap
  const allMachines = await getAllMachines();

  // fetch existing bookings from ggLeap

  // fetch center (special) hours from ggLeap

  // initialize available durations as number[]: 90, 60

  // initialize available time slots as Date[]: between center (special) hours with 15 mininute intervals
  // generate available machines based on existing bookings

  // initialize selectedDate as Date: initial booking date

  // initialize selectedTime as Date: initial time slot

  // initialize selectedDuration as number: initial duration

  // show available machines for selected time

  // book selected machine for selected date, time, and duration

  return (
    <div>
      <DateSelect />
    </div>
  );
}
