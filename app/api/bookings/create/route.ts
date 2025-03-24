import { createBooking } from "@/lib/ggLeap";

export async function POST(request: Request) {
  console.log("__/api/bookings/create/__");

  try {
    // const { username, password } = await request.json();

    const bookingData = await createBooking();

    console.log("User:", bookingData);

    if (!bookingData) {
      throw new Error();
    }

    return new Response(
      JSON.stringify({ message: `Booking created: '${bookingData}'` }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ message: "An error occurred while booking." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
