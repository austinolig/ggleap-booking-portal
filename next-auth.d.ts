import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface User {
		Email: string;
		FirstName: string;
		LastName: string;
		Username: string;
		Uuid: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: User;
	}
}
