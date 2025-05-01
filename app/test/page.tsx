import { getCenterInfo } from "@/lib/ggLeap";
import BookingForm from "@/components/booking-form";

export default async function Test() {
	const centerInfo = await getCenterInfo();

	if (!centerInfo) {
		return <div>Error fetching center information</div>;
	}

	return <BookingForm centerInfo={centerInfo} />;
}
