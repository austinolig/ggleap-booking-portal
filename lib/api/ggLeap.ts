"use server";

import { Booking, BookingUuid, CenterHours, JWT, Machine } from "@/types";
import { auth } from "@/auth";
import { User } from "next-auth";
import { format } from "date-fns";

const centerUuid = "50dd0be4-13eb-4db3-94b3-09e3062fa2d9";

export async function getJWT(): Promise<JWT | null> {
	console.log("__getJWT()__");

	try {
		console.log("Fetching JWT...");

		const response = await fetch(
			"https://api.ggleap.com/production/authorization/public-api/auth",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ AuthToken: process.env.GGLEAP_API_TOKEN }),
				cache: "force-cache",
				next: { revalidate: 300 },
			}
		);

		if (!response.ok) {
			throw new Error(`(${response.status}) Failed to fetch JWT`);
		}

		const data = await response.json();
		if (!data.Jwt) {
			throw new Error("Missing JWT in response");
		}

		console.log("JWT:", data.Jwt);

		return data.Jwt;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function login(
	username: string,
	password: string
): Promise<User | null> {
	console.log("__login()__");

	try {
		console.log(`Logging in '${username}'...`);

		const response = await fetch(
			"https://api.ggleap.com/production/authorization/user/login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-gg-client": "DynamicCenterPagesWeb 0.1",
				},
				body: JSON.stringify({
					Username: username,
					Password: password,
					CenterUuid: centerUuid,
				}),
			}
		);

		const data = await response.json();
		if (!data.User || !response.ok) {
			console.log("data:", data);
			throw new Error(`(${response.status}) Failed to login`);
		}

		console.log("User:", data.User);
		return data.User;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getAllMachines(): Promise<Machine[] | null> {
	console.log("__getAllMachines()__");

	const jwt = await getJWT();
	if (!jwt) {
		return null;
	}

	try {
		console.log("Fetching machines...");

		const response = await fetch(
			"https://api.ggleap.com/production/machines/get-all",
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
			}
		);

		const data = await response.json();
		if (!data.Machines || !response.ok) {
			console.log("data:", data);
			throw new Error(`(${response.status}) Failed to fetch machines`);
		}

		const machines = data.Machines.map((machine: Machine) => ({
			Uuid: machine.Uuid,
			Name: machine.Name,
		}));

		console.log("machines:", machines);
		return machines;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getAvailableMachines(
	bookingStart: string,
	duration: number
): Promise<Machine[] | null> {
	console.log("__getAvailableMachines()__");

	const jwt = await getJWT();
	if (!jwt) {
		return null;
	}

	try {
		console.log("Fetching available machines...");

		const response = await fetch(
			"https://api.ggleap.com/production/bookings/get-available-machines",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
				body: JSON.stringify({
					Start: bookingStart,
					Duration: duration,
				}),
			}
		);

		const data = await response.json();
		if (!data.Machines || !response.ok) {
			console.log("data:", data);
			throw new Error(
				`(${response.status}) Failed to fetch available machines`
			);
		}

		console.log("Machines:", data.Machines);
		return data.Machines;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createBooking(
	bookingStart: string,
	duration: number,
	machineUuid: string
): Promise<BookingUuid | null> {
	console.log("__createBooking()__");

	const jwt = await getJWT();
	if (!jwt) {
		return null;
	}

	const session = await auth();
	if (!session?.user) {
		return null;
	}

	try {
		console.log("Creating booking...");

		const response = await fetch(
			"https://api.ggleap.com/production/bookings/create",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
				body: JSON.stringify({
					Booking: {
						Start: bookingStart,
						Duration: duration,
						Machines: [machineUuid],
						Name: session.user.Username,
						BookerEmail: session.user.Email,
						UserUuid: session.user.Uuid,
					},
				}),
			}
		);

		const data = await response.json();
		if (!data.BookingUuid || !response.ok) {
			console.log("data:", data);
			throw new Error(`(${response.status}) Failed to fetch create booking`);
		}

		console.log("BookingUuid:", data.BookingUuid);
		return data.BookingUuid;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getBookings(): Promise<Booking[] | null> {
	console.log("__getBookings()__");

	const jwt = await getJWT();
	if (!jwt) {
		return null;
	}

	try {
		console.log("Fetching bookings...");

		const dateQuery = format(new Date(), "yyyy-MM-dd");

		const response = await fetch(
			`https://api.ggleap.com/production/bookings/get-bookings?Date=${dateQuery}&Days=2`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
			}
		);

		const data = await response.json();
		if (!data.Bookings || !response.ok) {
			console.log("data:", data);
			throw new Error(`(${response.status}) Failed to fetch bookings`);
		}

		const bookings = data.Bookings.map((booking: Booking) => ({
			Start: booking.Start,
			Duration: booking.Duration,
			Machines: booking.Machines,
		}));

		console.log("Bookings:", bookings);
		return bookings;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getCenterHours(): Promise<CenterHours | null> {
	console.log("__getCenterHours()__");

	try {
		console.log("Fetching center hours...");

		const response = await fetch(
			`https://api.ggleap.com/production/public_center_info?CenterUuid=${centerUuid}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();
		if (!data.CenterOpeningHours || !response.ok) {
			throw new Error(`(${response.status}) Failed to fetch center info`);
		}

		console.log("CenterHours:", data.CenterOpeningHours);
		return data.CenterOpeningHours;
	} catch (error) {
		console.error(error);
		return null;
	}
}
