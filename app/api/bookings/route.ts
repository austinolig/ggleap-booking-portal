import { getBookings } from "@/lib/ggLeap";

export async function GET() {
	console.log("__/api/bookings/__");

	const bookings = await getBookings();

	console.log("bookings", bookings);

	return new Response(null, {
		status: 204,
	});
}
