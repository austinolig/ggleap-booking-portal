"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import InputWithIcon from "./input-with-icon";
import { KeyRound, User } from "lucide-react";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState("");

  return (
    <main className={cn("flex flex-col gap-6", className)} {...props}>
      <p>Log in with your ggLeap account</p>
      <form
        action={async (formData) => {
          try {
            await signInWithCredentials(formData);
          } catch {
            setError("Invalid username or password. Please try again.");
          }
        }}
      >
        <div className="flex flex-col gap-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Label htmlFor="username" className="sr-only">
            Username
          </Label>
          <InputWithIcon
            icon={<User />}
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            required
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <InputWithIcon
              icon={<KeyRound />}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <Dialog>
              <DialogTrigger className="block ml-auto text-sm underline-offset-4 underline text-muted-foreground cursor-pointer hover:text-primary">
                Forgot your password?
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex flex-col gap-6">
                  <DialogTitle>Forgot your password?</DialogTitle>
                  <DialogDescription>
                    To reset your password, please visit our front desk at the
                    OTSU office (SHA 115).
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col gap-1">
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
