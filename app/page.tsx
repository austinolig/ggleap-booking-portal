import { auth, signOut } from "@/auth";
import BookingForm from "@/components/booking-form-old";
import { Suspense } from "react";
import Loading from "./loading";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  console.log(session);

  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="absolute top-18 right-6"
      >
        <Button
          className="cursor-pointer"
          type="submit"
          variant={"outline"}
          size={"icon"}
        >
          <LogOut />
        </Button>
      </form>
      <p className="absolute top-6 left-6">
        <span className="font-bold">{session.user.Username}</span>
      </p>
      <main className="space-y-6">
        <p>Book a PC</p>
        <Suspense fallback={<Loading />}>
          <BookingForm />
        </Suspense>
      </main>
    </>
  );
}
