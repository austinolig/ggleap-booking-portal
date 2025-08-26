"use server";

import { signIn, signOut } from "@/auth";
import { SignupData } from "@/types";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import {
  addUserGamePass,
  createBooking,
  createUser,
  deleteBooking,
  deleteUserGamePasses,
  getUserGamePasses,
  updateBookingDuration,
} from "./ggLeap";
import { revalidateTag } from "next/cache";

export async function signInAction(formData: FormData): Promise<string | void> {
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
  selectedMachineId: string,
): Promise<string | void> {
  const userGamePasses = await getUserGamePasses();

  if (userGamePasses && userGamePasses.length > 0) {
    await deleteUserGamePasses(userGamePasses);
  }

  const bookingUuid = await createBooking(
    selectedTime,
    selectedDuration,
    selectedMachineId,
  );

  if (!bookingUuid) {
    return "Booking Unsuccessful";
  }

  await addUserGamePass(selectedDuration);
}

export async function deleteBookingAction(
  bookingUuid: string,
): Promise<boolean | null> {
  return await deleteBooking(bookingUuid);
}

export async function extendBookingAction(): Promise<string | void> {
  const bookingUuid = await updateBookingDuration();
  if (!bookingUuid) {
    return "Failed to extend booking. Please try again.";
  }

  await addUserGamePass(15);
}

export async function revalidateBookings(): Promise<void> {
  console.log("Revalidating bookings...");
  revalidateTag("bookings");
}
