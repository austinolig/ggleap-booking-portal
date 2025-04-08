"use server";

import { signIn } from "@/auth";

export async function signInWithCredentials(formData: FormData) {
	await signIn("credentials", formData);
}
