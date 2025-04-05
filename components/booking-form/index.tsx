import { getAllMachines, getBookings, getCenterHours } from "@/lib/ggLeap";
import DateSelect from "./date-select";
import DurationSelect from "./duration-select";
import TimeSelect from "./time-select";
import MachineSelect from "./machine-select";

export default async function BookingForm() {
	const allMachines = await getAllMachines();
	const centerHours = await getCenterHours();
	const bookings = await getBookings();

	if (!allMachines || !centerHours || !bookings) {
		return <div>Error fetching data</div>;
	}

	return (
		<div>
			<DateSelect />
			<DurationSelect />
			<TimeSelect
				centerHours={centerHours}
				bookings={bookings}
				allMachines={allMachines}
			/>
			<MachineSelect />
		</div>
	);
}
