"use client";

import React, { useState } from "react";
import { signOutAction } from "@/lib/actions";
import { LogOut, User } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { Button } from "../ui/button";

export default function UserMenu({ session }: { session: Session }) {
	const [open, setOpen] = useState(false);
	const handleSignOut = async () => await signOutAction();
	return (
		<>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant={open ? "outlineSelected" : "outline"}
						size="icon"
						className="absolute top-4 left-4"
					>
						<User width={20} height={20} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuLabel>{session.user?.Username}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer">
						<form
							action={handleSignOut}
							className="w-full"
						>
							<button
								className="w-full cursor-pointer flex justify-between items-center"
								type="submit"
							>
								Sign Out
								<LogOut />
							</button>
						</form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
