"use server";

import { signIn, signOut } from "@/auth";
import { SignupData } from "@/types";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import {
	createBooking,
	createUser,
	deleteBooking,
	updateBookingDuration
} from "./ggLeap";
import { revalidatePath } from "next/cache";

export async function signInAction(
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

export async function signOutAction(): Promise<void> {
	await signOut();
}

export async function signUpAction(formData: FormData): Promise<string | void> {
	const vals = Object.fromEntries(formData.entries()) as SignupData;
	const userUuid = await createUser(vals);
	if (!userUuid) {
		return "Failed to create user. Please try again.";
	}
	redirect("/signin");
}

export async function createBookingAction(
	selectedTime: Date,
	selectedDuration: number,
	selectedMachineId: string
): Promise<string | void> {
	const bookingUuid = await createBooking(selectedTime, selectedDuration, selectedMachineId);
	if (!bookingUuid) {
		return "Failed to create booking. Please try again.";
	}
}

export async function deleteBookingAction(
	bookingUuid: string
): Promise<boolean> {
	return await deleteBooking(bookingUuid);
}

export async function extendBookingAction(): Promise<string | void> {
	const bookingUuid = await updateBookingDuration();
	if (!bookingUuid) {
		return "Failed to extend booking. Please try again.";
	}
}

export async function revalidateHomePath(): Promise<void> {
	console.log("Revalidating home path...");
	revalidatePath("/");
}
