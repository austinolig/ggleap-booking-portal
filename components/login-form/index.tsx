"use client";

import { signInWithCredentials } from "@/lib/actions";
import LogInButton from "./log-in-button";
import { useState } from "react";

export default function LoginForm() {
	const [error, setError] = useState("");

	return (
		<>
			<p className="text-red-500">{error}</p>
			<form
				action={async (formData) => {
					try {
						await signInWithCredentials(formData);
					} catch {
						setError("Unable to log in. Please try again.");
					}
				}}
			>
				<label>
					Username
					<input name="username" type="text" required />
				</label>
				<label>
					Password
					<input name="password" type="password" required />
				</label>
				<LogInButton />
			</form>
		</>
	);
}
