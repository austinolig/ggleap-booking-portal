"use client";

import { Button } from "@/components/ui/button";
import { signInAction } from "@/lib/actions";
import { useState } from "react";
import { KeyRound, LoaderCircle, User } from "lucide-react";
import { useFormStatus } from "react-dom";
import FormInput from "../ui/form-input";

export default function SigninForm() {
	const [error, setError] = useState("");
	const handleSubmit = async (formData: FormData) => {
		const error = await signInAction(formData);
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
				</div>
				<SignInButton />
			</div>
		</form>
	);
}

function SignInButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" variant="default" className="w-full cursor-pointer" disabled={pending}>
			{pending && <LoaderCircle className="animate-spin" />}
			<span>Sign In</span>
		</Button>
	);
}
