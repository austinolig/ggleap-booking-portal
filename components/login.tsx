"use client";

import { FormEvent, useState } from "react";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		try {
			const result = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await result.json();

			console.log(data);

			// TODO
			// store session
		} catch (error) {
			console.error(error);
		}
	}

	// TODO
	// display login errors

	return (
		<div className="p-4 border-1">
			<p className="font-bold">Login</p>
			<form onSubmit={handleSubmit}>
				<div className="border-1 p-4 flex gap-4">
					<label htmlFor="username">Username:</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="border-1"
					/>
				</div>
				<div className="border-1 p-4 flex gap-4">
					<label htmlFor="password">Password:</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="border-1"
					/>
				</div>
				<button type="submit" className="border-1 p-4 cursor-pointer">
					Log in
				</button>
			</form>
		</div>
	);
}
