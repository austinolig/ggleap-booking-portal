import { auth, signOut } from "@/auth";
import BookingForm from "@/components/booking-form-old";
import { Suspense } from "react";
import Loading from "./loading";
import LoginForm from "@/components/login-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
	const session = await auth();

	if (!session?.user) {
		return <LoginForm />;
	}

	console.log(session);

	return (
		<main>
			<Suspense fallback={<Loading />}>
				<Card>
					<CardHeader>
						<form
							action={async () => {
								"use server";
								await signOut();
							}}
							className="mb-6"
						>
							<Button type="submit" variant={"outline"}>
								Log Out
							</Button>
						</form>
						<CardTitle>Book a PC</CardTitle>
						<CardDescription>
							You are logged in as{" "}
							<span className="font-bold">{session.user.Username}</span>.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{/* <p>Select a Date</p>
						<p>Select a Duration</p>
						<p>Select a Time Slot</p>
						<p>Select a PC</p> */}

						<BookingForm />
					</CardContent>
				</Card>
			</Suspense>
		</main>
	);
}
