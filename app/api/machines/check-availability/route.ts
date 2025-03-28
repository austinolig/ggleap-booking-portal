import { getAvailableMachines } from "@/lib/ggLeap";

export async function POST(request: Request) {
	console.log("__/api/machines/check-availability/__");

	try {
		const { bookingDateTime } = await request.json();

		const availableMachines = await getAvailableMachines(bookingDateTime);

		console.log("Available Machines:", availableMachines);

		if (!availableMachines) {
			throw new Error();
		}

		return new Response(
			JSON.stringify({
				message: `Available Machines: ${availableMachines.length}`,
				availableMachines: availableMachines,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch {
		return new Response(
			JSON.stringify({
				message: "An error occurred while getting available machines.",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
