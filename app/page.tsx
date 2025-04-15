import { auth, signOut } from "@/auth";
import BookingForm from "@/components/booking-form-old";
import { Suspense } from "react";
import Loading from "./loading";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function Home() {
	const session = await auth();

	if (!session?.user) {
		redirect("/signin");
	}

	console.log(session);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="absolute top-6 left-6 underline underline-offset-4 text-muted-foreground hover:text-primary cursor-pointer">
					{session.user.Username}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem className="cursor-pointer">
						<form
							action={async () => {
								"use server";
								await signOut();
							}}
							className="w-full"
						>
							<button
								className="w-full cursor-pointer flex gap-2 items-center"
								type="submit"
							>
								<LogOut />
								Sign Out
							</button>
						</form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<main className="space-y-6">
				<p className="font-bold text-lg text-muted-foreground">Book a PC</p>
				<Suspense fallback={<Loading />}>
					<BookingForm />
				</Suspense>
			</main>
		</>
	);
}
