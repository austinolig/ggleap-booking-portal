import { auth } from "@/auth";
import SignupForm from "@/components/signup-form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Signup() {
	const session = await auth();

	// redirect to home if session exists
	if (session?.user) {
		redirect("/");
	}

	return (
		<main className="flex flex-col gap-6">
			<p className="font-bold text-lg">Create a ggLeap account</p>
			<SignupForm />
			<p className="text-center text-sm text-muted-foreground">
				{"Already have an account? "}
				<Link
					href={"/signin"}
					className="underline underline-offset-4 hover:text-primary"
				>
					Sign In
				</Link>
			</p>
		</main>
	);
}
