"use server";

import { signIn, signOut as authSignOut } from "@/auth";
import { SignupData } from "@/types";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { createBooking, createUser } from "./ggLeap";

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
	await authSignOut();
}

export async function signUp(formData: FormData): Promise<string | void> {
	const vals = Object.fromEntries(formData.entries()) as SignupData;
	const userUuid = await createUser(vals);
	if (!userUuid) {
		return "Failed to create user. Please try again.";
	}
	redirect("/signin");
}

export async function confirmBooking(
	selectedTime: Date,
	selectedDuration: number,
	selectedMachineId: string
): Promise<string | void> {
	const bookingUuid = await createBooking(selectedTime, selectedDuration, selectedMachineId);
	if (!bookingUuid) {
		return "Failed to create booking. Please try again.";
	}
}
