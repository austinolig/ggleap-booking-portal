import Booking from "@/components/booking";
import CreateBooking from "@/components/create-booking";
import Login from "@/components/login";
import Machines from "@/components/machines";

export default async function Home() {
	return (
		<main className="flex flex-col p-4 gap-4">
			<h1>ggLeap Booking Portal</h1>
			<Machines />
			<Login />
			<Booking />
			<CreateBooking />
		</main>
	);
}
