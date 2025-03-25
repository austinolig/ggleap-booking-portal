import { auth, signIn, signOut } from "@/auth";
import BookingForm from "@/components/booking-form";

export default async function Home() {
	const session = await auth();

	if (!session?.user) {
		return (
			<form
				action={async (formData) => {
					"use server";
					await signIn("credentials", formData);
				}}
			>
				<label htmlFor="username">
					Username
					<input name="username" type="username" />
				</label>
				<label htmlFor="password">
					Password
					<input name="password" type="password" />
				</label>
				<button>Sign In</button>
			</form>
		);
	}

	console.log(session);

	return (
		<main className="p-4">
			{session.user.Username}
			<BookingForm />
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit">Sign Out</button>
			</form>
		</main>
	);
}
