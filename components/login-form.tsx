import { signIn } from "@/auth";

export default function LoginForm() {
	return (
		<form
			action={async (formData) => {
				"use server";
				await signIn("credentials", formData);
			}}
		>
			<label htmlFor="username">
				Username
				<input name="username" type="username" />
			</label>
			<label htmlFor="password">
				Password
				<input name="password" type="password" />
			</label>
			<button>Sign In</button>
		</form>
	);
}
