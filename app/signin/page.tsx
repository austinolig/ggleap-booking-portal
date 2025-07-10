import { auth } from "@/auth";
import SigninForm from "@/components/signin-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
			<p className="font-bold text-lg text-center">Sign in with your ggLeap account</p>
			<SigninForm />
			<div className="flex flex-col items-center gap-1">
				<p className="text-center text-sm text-muted-foreground">
					{"Don't have an account? "}
					<Link
						href={"/signup"}
						className="underline underline-offset-4 hover:text-primary"
					>
						Create Account
					</Link>
				</p>
				<Dialog>
					<DialogTrigger className="text-center text-sm text-muted-foreground underline underline-offset-4 hover:text-primary cursor-pointer">
						Forgot your password?
					</DialogTrigger>
					<DialogContent>
						<DialogHeader className="flex flex-col gap-6">
							<DialogTitle>Forgot your password?</DialogTitle>
							<DialogDescription>
								To reset your password, please visit our front desk at the OTSU
								office (SHA 115).
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</main>
	);
}
