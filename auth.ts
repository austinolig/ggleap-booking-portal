import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./lib/ggLeap";

type LoginCredentials = {
	username: string;
	password: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				username: { label: "Username" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				const { username, password } = credentials as LoginCredentials;

				const userData = await login(username, password);

				console.log("UserResponse:", userData);

				if (!userData) {
					throw new Error();
				}

				const user = {
					Uuid: userData.User.Uuid,
					Username: userData.User.Username,
					Email: userData.User.Email,
					FirstName: userData.User.FirstName,
					LastName: userData.User.LastName,
				};

				return user;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = token.user;
			return session;
		},
	},
});
