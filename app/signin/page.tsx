import { auth } from "@/auth";
import SigninForm from "@/components/signin-form";
import { redirect } from "next/navigation";

export default async function Signin() {
  const session = await auth();

  // redirect to home if session exists
  if (session?.user) {
    redirect("/");
  }

  return <SigninForm />;
}
