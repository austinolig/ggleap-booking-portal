import React from "react";
import { signOut } from "@/lib/actions";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function UserMenu({ session }: { session: Session }) {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className="absolute top-6 left-6 cursor-pointer data-[state=open]:border-primary data-[state=open]:text-primary">
						<AvatarFallback>
							<User width={20} height={20} />

						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuLabel>{session.user?.Username}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer">
						<form
							action={async () => {
								"use server";
								await signOut();
							}}
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
