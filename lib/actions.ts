"use server";

import { signIn } from "@/auth";
import { SignupData } from "@/types";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { createUser } from "./ggLeap";

export async function signInWithCredentials(
	formData: FormData
): Promise<string | void> {
	try {
		await signIn("credentials", formData);
	} catch (error) {
		if (error instanceof CredentialsSignin) {
			return "Invalid username or password. Please try again.";
		}
		redirect("/"); // 'Error: NEXT_REDIRECT' is considered a successful response
	}
}

export async function signOut(): Promise<void> {
	await signOut();
}

export async function signUp(formData: FormData): Promise<string | void> {
	const vals = Object.fromEntries(formData.entries()) as SignupData;
	const userUuid = await createUser(vals);
	if (!userUuid) {
		return "Failed to create user. Please try again.";
	}
	redirect("/signin");
}
