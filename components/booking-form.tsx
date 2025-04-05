import { getAllMachines, getBookings, getCenterHours } from "@/lib/ggLeap";
import DateSelect from "./date-select";
import DurationSelect from "./duration-select";
import TimeSelect from "./time-select";
import MachineSelect from "./machine-select";

export default async function BookingForm() {
	// initialize all machines as Machine[]: fetch from ggLeap
	const allMachines = await getAllMachines();
	// fetch center (special) hours from ggLeap
	const centerHours = await getCenterHours();
	// fetch existing bookings from ggLeap
	const bookings = await getBookings();

	if (!allMachines || !centerHours || !bookings) {
		return <div>Error fetching data</div>;
	}

	// initialize selectedDate as Date: initial booking date

	// initialize selectedTime as Date: initial time slot

	// initialize selectedDuration as number: initial duration

	// show available machines for selected time

	// book selected machine for selected date, time, and duration

	return (
		<div>
			<DateSelect />
			<DurationSelect />
			<TimeSelect
				centerHours={centerHours}
				bookings={bookings}
				allMachines={allMachines}
			/>
			<MachineSelect allMachines={allMachines} />
		</div>
	);
}
