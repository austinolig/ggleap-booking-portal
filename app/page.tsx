import { auth, signOut } from "@/auth";
// import BookingForm from "@/components/booking-form";
// import BookingForm2 from "@/components/booking-form-2";
// import BookingForm3 from "@/components/booking-form-3";
import BookingForm4 from "@/components/booking-form-4";
import LoginForm from "@/components/login-form";
import { getBookings } from "@/lib/api/ggLeap";

export default async function Home() {
	const session = await auth();
	const bookings = await getBookings(new Date("March 27, 2025").toISOString());

	if (!session?.user || !bookings) {
		return <LoginForm />;
	}

	console.log(session);
	// console.log(bookings);

	return (
		<main className="p-4 space-y-6">
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit">Log Out</button>
			</form>
			<hr />
			<p>{session.user.Username}</p>
			{/* <hr />
			<BookingForm />
			<hr />
			<BookingForm2 />
      <hr />
      <BookingForm3 /> */}
			<hr />
			<BookingForm4 bookings={bookings} />
		</main>
	);
}
