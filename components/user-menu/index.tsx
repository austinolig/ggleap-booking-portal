import React from "react";
import { signOut } from "@/lib/actions";
import { LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";

export default async function UserMenu({ session }: { session: Session }) {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="absolute top-6 left-6 underline underline-offset-4 text-muted-foreground hover:text-primary cursor-pointer">
					{session.user?.Username}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem className="cursor-pointer">
						<form
							action={async () => {
								"use server";
								await signOut();
							}}
							className="w-full"
						>
							<button
								className="w-full cursor-pointer flex gap-2 items-center"
								type="submit"
							>
								<LogOut />
								Sign Out
							</button>
						</form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
