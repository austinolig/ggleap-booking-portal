import { auth } from "@/auth";
import SignupForm from "@/components/signup-form";
import { redirect } from "next/navigation";

export default async function Signup() {
  const session = await auth();

  // redirect to home if session exists
  if (session?.user) {
    redirect("/");
  }

  return <SignupForm />;
}
