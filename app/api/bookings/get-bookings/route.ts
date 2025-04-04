import { getBookings } from "@/lib/api/ggLeap";

export async function POST(request: Request) {
	console.log("__/api/bookings/get-bookings/__");

	try {
		const bookings = await getBookings();

		if (!bookings) {
			throw new Error();
		}

		console.log("Bookings:", bookings);

		return new Response(
			JSON.stringify({
				message: `Bookings: ${bookings.length}`,
				bookings: bookings,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch {
		return new Response(
			JSON.stringify({
				message: "An error occurred while getting bookings.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
