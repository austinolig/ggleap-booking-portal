"use client";

import { createBooking } from "@/lib/ggLeap";

export default function CreateBooking() {
	return <button onClick={createBooking}>Create Booking</button>;
}
