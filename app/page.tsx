import { auth, signOut } from "@/auth";
// import BookingForm from "@/components/booking-form";
import BookingForm2 from "@/components/booking-form-2";
import LoginForm from "@/components/login-form";

export default async function Home() {
	const session = await auth();

	if (!session?.user) {
		return <LoginForm />;
	}

	console.log(session);

	return (
		<main className="p-4">
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit">Log Out</button>
			</form>
			<hr />
			<p>Username: {session.user.Username}</p>
			{/* <hr /> */}
			{/* <BookingForm /> */}
			<hr />
			<BookingForm2 />
		</main>
	);
}
