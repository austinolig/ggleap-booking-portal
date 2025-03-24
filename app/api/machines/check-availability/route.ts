import { getAvailableMachines } from "@/lib/ggLeap";

export async function POST(request: Request) {
  console.log("__/api/machines/check-availability/__");

  try {
    const { bookingTime } = await request.json();

    const availableMachinesData = await getAvailableMachines(bookingTime);

    console.log("Available Machines:", availableMachinesData);

    if (!availableMachinesData) {
      throw new Error();
    }

    return new Response(
      JSON.stringify({
        message: `Available Machines: ${availableMachinesData.Machines.length}`,
        availableMachines: availableMachinesData,
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
