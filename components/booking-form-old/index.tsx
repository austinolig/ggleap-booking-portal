import { getCenterInfo } from "@/lib/ggLeap";
import DateSelect from "./date-select";
import DurationSelect from "./duration-select";
import TimeSelect from "./time-select";

export default async function BookingForm() {
	const centerInfo = await getCenterInfo();

	if (!centerInfo) {
		return <div>Error fetching data</div>;
	}

	return (
		<div className="space-y-6">
			<DateSelect />
			<DurationSelect />
			<TimeSelect centerInfo={centerInfo} />
		</div>
	);
}
