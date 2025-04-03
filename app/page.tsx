import { auth, signOut } from "@/auth";
// import BookingForm from "@/components/booking-form";
import BookingForm2 from "@/components/booking-form-2";
// import BookingForm3 from "@/components/booking-form-3";
// import BookingForm4 from "@/components/booking-form-4";
import LoginForm from "@/components/login-form";
import { getBookings, getCenterHours } from "@/lib/api/ggLeap";

export default async function Home() {
  const session = await auth();
  const bookings = await getBookings(new Date().toISOString());
  const centerHours = await getCenterHours();

  if (!session?.user || !bookings || !centerHours) {
    return <LoginForm />;
  }

  console.log(session);

  return (
    <main className="p-4 space-y-6">
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
      {/* <hr />
			<BookingForm />
      */}
      <hr />
      <BookingForm2 />
      {/* <hr />
      <BookingForm3 /> */}
      {/* <hr />
      <BookingForm4 bookings={bookings} centerHours={centerHours} /> */}
    </main>
  );
}
