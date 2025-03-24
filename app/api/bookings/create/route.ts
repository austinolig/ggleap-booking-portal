import { createBooking } from "@/lib/ggLeap";

export async function POST(request: Request) {
  console.log("__/api/bookings/create/__");

  try {
    const { bookingTime } = await request.json();

    console.log("Booking Time:", bookingTime);

    const bookingData = await createBooking(bookingTime);

    console.log("bookingData:", bookingData);

    if (!bookingData) {
      throw new Error();
    }

    return new Response(
      JSON.stringify({
        message: `Booking created: '${bookingData.BookingUuid}'`,
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
