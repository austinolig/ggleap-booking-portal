import AuthForm from "@/components/auth-form";
import BookingForm from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="p-4">
      {/* <AuthForm /> */}
      <BookingForm />
    </main>
  );
}
