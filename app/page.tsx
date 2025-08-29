import BookingForm from "@/components/booking-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserMenu from "@/components/user-menu";
import { getCenterInfo, getUserBooking } from "@/lib/ggLeap";
import ExistingBooking from "@/components/existing-booking";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  const centerInfo = await getCenterInfo();
  const userBooking = await getUserBooking();

  if (!session?.user) {
    redirect("/signin");
  }

  if (!centerInfo) {
    return (
      <main className="text-center space-y-6">
        <div>
          <h2 className="text-6xl font-bold">429</h2>
          <p className="text-muted-foreground">
            Too many requests. Please try again in 1 minute.
          </p>
        </div>
        <Button asChild variant="default">
          <Link href="/">
            <RotateCcw />
            <span>Reload</span>
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <>
      <UserMenu session={session} />
      <main>
        {userBooking ? (
          <ExistingBooking
            booking={userBooking.booking}
            machine={userBooking.machine}
          />
        ) : (
          <BookingForm centerInfo={centerInfo} />
        )}
      </main>
    </>
  );
}
