import { auth } from "@/auth";
import SigninForm from "@/components/signin-form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Signin() {
	const session = await auth();

	// redirect to home if session exists
	if (session?.user) {
		redirect("/");
	}

	return (
		<main className="flex flex-col gap-6">
			<p>Sign in with your ggLeap account</p>
			<SigninForm />
			<p className="text-center text-sm text-muted-foreground">
				{"Don't have an account? "}
				<Link
					href={"/signup"}
					className="underline underline-offset-4 hover:text-primary"
				>
					Create Account
				</Link>
			</p>
		</main>
	);
}
