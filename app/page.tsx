import { auth, signOut } from "@/auth";
import LoginForm from "@/components/login-form";
import BookingForm from "@/components/booking-form";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <LoginForm />;
  }

  console.log(session);

  return (
    <main className="p-4 space-y-6">
      <Suspense fallback={<p>Loading...</p>}>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Log Out</button>
        </form>
        <hr />
        <p>{session.user.Username}</p>
        <hr />
        <BookingForm />
      </Suspense>
    </main>
  );
}
