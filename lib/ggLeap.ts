import { differenceInMinutes, set } from "date-fns";
import {
	JwtResponse,
	MachinesResponse,
	UserResponse,
	LoginRequest,
} from "./types/ggLeap";
import { auth } from "@/auth";

export async function getJWT(): Promise<JwtResponse> {
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

		const { Jwt } = await response.json();

		console.log("JWT:", Jwt);

		return Jwt;
	} catch (error) {
		console.error(error);

		return "";
	}
}

export async function getMachines(): Promise<MachinesResponse | null> {
	console.log("__getMachines()__");

	const jwt = await getJWT();

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

		console.log("MachinesResponse:", data);

		if (!response.ok) {
			throw new Error(`(${response.status}) Failed to fetch machines`);
		}

		return data;
	} catch (error) {
		console.error(error);

		return null;
	}
}

export async function login(
	username: string,
	password: string
): Promise<UserResponse | null> {
	console.log("__login()__");

	try {
		console.log(`Logging in '${username}'...`);

		const payload: LoginRequest = {
			Username: username,
			Password: password,
			CenterUuid: "50dd0be4-13eb-4db3-94b3-09e3062fa2d9",
		};

		const response = await fetch(
			"https://api.ggleap.com/production/authorization/user/login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-gg-client": "DynamicCenterPagesWeb 0.1",
				},
				body: JSON.stringify(payload),
			}
		);

		const data = await response.json();

		console.log("Response:", data);

		if (!response.ok) {
			throw new Error(`(${response.status}) Failed to login`);
		}

		return data;
	} catch (error) {
		console.error(error);

		return null;
	}
}

export async function getAvailableMachines(
	bookingTime: string
): Promise<MachinesResponse | null> {
	console.log("__getAvailableMachines()__");

	const jwt = await getJWT();

	try {
		console.log("Fetching available machines...");

		const bookingDate = new Date(bookingTime);

		const cutoffHour = 16;

		const cutoffDate = set(new Date(bookingTime), {
			hours: cutoffHour,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});

		const cutoffDifference = differenceInMinutes(cutoffDate, bookingDate);

		let duration = 90;

		if (cutoffDifference < 90) {
			duration = cutoffDifference;
		}

		const response = await fetch(
			"https://api.ggleap.com/production/bookings/get-available-machines",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
				body: JSON.stringify({
					Start: bookingTime,
					Duration: duration,
				}),
			}
		);

		const data = await response.json();

		console.log("MachinesResponse:", data);

		if (!response.ok) {
			throw new Error(
				`(${response.status}) Failed to fetch available machines`
			);
		}

		return data;
	} catch (error) {
		console.error(error);

		return null;
	}
}

export async function createBooking(
	bookingTime: string,
	machineUuid: string
): Promise<{ BookingUuid: string } | null> {
	console.log("__createBooking()__");

	const jwt = await getJWT();

	const session = await auth();

	if (!session?.user) {
		console.error("Failed to authenticate user");
		return null;
	}

	try {
		console.log("Creating booking...");

		const bookingDate = new Date(bookingTime);

		const cutoffHour = 16;

		const cutoffDate = set(new Date(bookingTime), {
			hours: cutoffHour,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});

		const cutoffDifference = differenceInMinutes(cutoffDate, bookingDate);

		let duration = 90;

		if (cutoffDifference < 90) {
			duration = cutoffDifference;
		}

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
						Start: bookingTime,
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

		console.log("BookingResponse:", data);

		if (!response.ok) {
			throw new Error(`(${response.status}) Failed to create booking`);
		}

		return data;
	} catch (error) {
		console.error(error);

		return null;
	}
}
