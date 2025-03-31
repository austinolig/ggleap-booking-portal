import { createBooking } from "@/lib/api/ggLeap";

export async function POST(request: Request) {
  console.log("__/api/bookings/create/__");

  try {
    const { bookingDateTime, duration, machineUuid } = await request.json();

    console.log("bookingDateTime:", bookingDateTime);

    const bookingUuid = await createBooking(
      bookingDateTime,
      duration,
      machineUuid
    );

    if (!bookingUuid) {
      throw new Error();
    }

    console.log("bookingUuid:", bookingUuid);

    return new Response(
      JSON.stringify({
        message: `Booking created`,
        bookingUuid: bookingUuid,
      }),
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
