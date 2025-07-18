import BookingForm from "@/components/booking-form";
import { Suspense } from "react";
import Loading from "./loading";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserMenu from "@/components/user-menu";
import { getCenterInfo, getUserBooking } from "@/lib/ggLeap";
import ExistingBooking from "@/components/existing-booking";

export default async function Home() {
	const session = await auth();
	const centerInfo = await getCenterInfo();
	const userBooking = await getUserBooking();

	if (!session?.user) {
		redirect("/signin");
	}

	if (!centerInfo) {
		return <div>Error: Too many requests. Please try again in 1 minute.</div>;
	}

	return (
		<>
			<UserMenu session={session} />
			<main>
				<Suspense fallback={<Loading />}>
					{userBooking
						? <ExistingBooking booking={userBooking} />
						: <BookingForm centerInfo={centerInfo} />
					}
				</Suspense>
			</main>
		</>
	);
}
