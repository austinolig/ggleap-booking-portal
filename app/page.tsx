import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="p-4">
      <div className="flex-1">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href="/create-account">Create Account</Link>
        </Button>
      </div>
    </main>
  );
}
