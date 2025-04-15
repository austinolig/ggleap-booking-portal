"use client";

import { Button } from "@/components/ui/button";
import { signInWithCredentials } from "@/lib/actions";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { KeyRound, LoaderCircle, User } from "lucide-react";
import { useFormStatus } from "react-dom";
import FormInput from "./form-input";

export default function SigninForm() {
	const [error, setError] = useState("");
	const handleSubmit = async (formData: FormData) => {
		const error = await signInWithCredentials(formData);
		if (error) {
			setError(error); // TODO: display error from api response
		}
	};

	return (
		<form action={handleSubmit}>
			<div className="flex flex-col gap-6">
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<FormInput
					icon={<User />}
					id="username"
					name="username"
					type="text"
					placeholder="Username"
					required
				/>
				<div className="flex flex-col gap-1">
					<FormInput
						icon={<KeyRound />}
						id="password"
						name="password"
						type="password"
						placeholder="Password"
						required
					/>
					<Dialog>
						<DialogTrigger className="block ml-auto text-sm underline-offset-4 underline text-muted-foreground cursor-pointer hover:text-primary">
							Forgot your password?
						</DialogTrigger>
						<DialogContent>
							<DialogHeader className="flex flex-col gap-6">
								<DialogTitle>Forgot your password?</DialogTitle>
								<DialogDescription>
									To reset your password, please visit our front desk at the
									OTSU office (SHA 115).
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>
				<SignInButton />
			</div>
		</form>
	);
}

function SignInButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" className="w-full cursor-pointer" disabled={pending}>
			{pending && <LoaderCircle className="animate-spin" />}
			<span>Sign In</span>
		</Button>
	);
}
