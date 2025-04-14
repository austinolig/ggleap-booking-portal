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

export async function signUp(formData: FormData): Promise<string | void> {
  const vals = Object.fromEntries(formData.entries()) as SignupData;
  console.log("signUp", vals);

  // const data = {
  //   username: "test12345678",
  //   password: "test123",
  //   firstName: "asd",
  //   lastName: "asd",
  //   studentNumber: "123",
  //   studentEmail: "asd@gmail.com",
  //   dateOfBirth: "1996-12-16T00:00:00Z",
  //   discordId: "ok#123",
  // };

  // await createUser(data);

  // try {
  //   await signIn("credentials", formData);
  // } catch (error) {
  //   if (error instanceof CredentialsSignin) {
  //     return "Invalid username or password. Please try again.";
  //   }
  //   redirect("/"); // 'Error: NEXT_REDIRECT' is considered a successful response
  // }
}
