import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./lib/ggLeap";

type LoginCredentials = {
	username: string;
	password: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			authorize: async (credentials) => {
				const { username, password } = credentials as LoginCredentials;

				const userData = await login(username, password);

				if (!userData) {
					throw new CredentialsSignin();
				}

				const user = {
					Uuid: userData.Uuid,
					Username: userData.Username,
					Email: userData.Email,
					FirstName: userData.FirstName,
					LastName: userData.LastName,
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
