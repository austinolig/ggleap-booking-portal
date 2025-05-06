import BookingForm from "@/components/booking-form";
import { Suspense } from "react";
import Loading from "./loading";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import UserMenu from "@/components/user-menu";
import { getCenterInfo } from "@/lib/ggLeap";

export default async function Home() {
	// const session = await auth();
	const centerInfo = await getCenterInfo();

	// if (!session?.user) {
	// 	redirect("/signin");
	// }

	if (!centerInfo) {
		return <div>Error fetching center information</div>;
	}

	// console.log(session);

	return (
		<>
			{/* <UserMenu session={session} /> */}
			<main className="space-y-6">
				<p className="font-bold text-lg">Book a PC</p>
				<Suspense fallback={<Loading />}>
					<BookingForm centerInfo={centerInfo} />
				</Suspense>
			</main>
		</>
	);
}
