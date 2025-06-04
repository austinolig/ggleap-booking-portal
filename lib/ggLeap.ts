import {
	Booking,
	BookingUuid,
	CenterHours,
	CenterInfo,
	JWT,
	Machine,
	SignupData,
	UserUuid,
} from "@/types";
import { User } from "next-auth";
import { addMinutes, format } from "date-fns";
import { auth } from "@/auth";

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

export async function getBookings(): Promise<Booking[] | null> {
	console.log("__getBookings()__");

	const jwt = await getJWT();
	if (!jwt) {
		return null;
	}

	try {
		console.log("Fetching bookings...");

		const dateQuery = format(new Date("April 10 2025"), "yyyy-MM-dd");

		console.log("Current date:", new Date());
		console.log("dateQuery:", dateQuery);

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

		console.log("Bookings (pre-processing):", data.Bookings);
		const bookings = data.Bookings.map((booking: Booking) => ({
			BookingUuid: booking.BookingUuid,
			Start: booking.Start,
			Duration: booking.Duration,
			Machines: booking.Machines,
			Name: booking.Name,
		}));
		console.log("Bookings (post-processing):", bookings);
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

		console.log("CenterOpeningHours:", data.CenterOpeningHours);
		return data.CenterOpeningHours;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getCenterInfo(): Promise<CenterInfo | null> {
	console.log("__getCenterInfo()__");

	return {
		hours: {
			Regular: {
				Sunday: [],
				Monday: [],
				Tuesday: [],
				Wednesday: [],
				Thursday: [],
				Friday: [],
				Saturday: [],
			},
			Special: {
				"2024-08-07": [],
				"2024-08-11": [],
				"2024-08-19": [],
				"2024-08-27": [],
				"2024-09-01": [],
				"2024-09-12": [],
				"2024-09-16": [],
				"2024-09-19": [],
				"2024-09-18": [],
				"2024-10-11": [],
				"2024-10-19": [],
				"2024-11-02": [],
				"2024-11-03": [],
				"2024-11-04": [],
				"2024-11-05": [],
				"2024-11-06": [],
				"2024-11-07": [],
				"2024-11-08": [],
				"2024-11-09": [],
				"2024-11-10": [],
				"2024-11-11": [],
				"2024-11-13": [],
				"2024-11-14": [],
				"2024-11-12": [],
				"2024-11-15": [],
				"2024-11-16": [],
				"2024-11-17": [],
				"2024-11-18": [],
				"2024-11-19": [],
				"2024-11-20": [],
				"2024-11-21": [],
				"2024-11-22": [],
				"2024-11-23": [],
				"2024-11-24": [],
				"2024-11-25": [],
				"2024-11-26": [],
				"2024-11-27": [],
				"2024-11-28": [],
				"2024-11-29": [],
				"2024-11-30": [],
				"2024-12-01": [],
				"2024-12-02": [],
				"2024-12-03": [],
				"2024-12-04": [],
				"2024-12-26": [],
				"2025-01-17": [],
				"2025-01-19": [],
				"2025-02-15": [],
				"2025-02-23": [],
				"2025-03-02": [],
				"2025-03-04": [],
				"2025-03-12": [],
				"2025-03-20": [],
				"2025-03-28": [],
			},
		},
		bookings: [
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T16:00:00Z",
				Duration: 90,
				Machines: ["32e486b1-4dc1-4462-940f-79415750eeb8"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T16:00:00Z",
				Duration: 90,
				Machines: ["dfcd4bdc-7c57-475d-b486-b842dcf0a9ba"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T18:00:00Z",
				Duration: 90,
				Machines: ["21116719-3c0b-45f9-bc6c-12f70a245851"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T18:00:00Z",
				Duration: 90,
				Machines: ["68bc1314-17d4-4039-ac63-a5b4b198de7c"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T18:00:00Z",
				Duration: 90,
				Machines: ["931e35e4-e28a-4ca3-b5b6-fc87625d346e"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T18:15:00Z",
				Duration: 15,
				Machines: ["e0833473-359f-4c65-9b6a-1f7f22375a71"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T19:30:00Z",
				Duration: 30,
				Machines: ["68bc1314-17d4-4039-ac63-a5b4b198de7c"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T19:30:00Z",
				Duration: 30,
				Machines: ["931e35e4-e28a-4ca3-b5b6-fc87625d346e"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-10T19:30:00Z",
				Duration: 30,
				Machines: ["21116719-3c0b-45f9-bc6c-12f70a245851"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-11T14:45:00Z",
				Duration: 75,
				Machines: ["dfcd4bdc-7c57-475d-b486-b842dcf0a9ba"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-11T16:30:00Z",
				Duration: 90,
				Machines: ["68bc1314-17d4-4039-ac63-a5b4b198de7c"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-11T17:30:00Z",
				Duration: 15,
				Machines: ["21116719-3c0b-45f9-bc6c-12f70a245851"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-11T18:30:00Z",
				Duration: 90,
				Machines: ["21116719-3c0b-45f9-bc6c-12f70a245851"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-11T18:30:00Z",
				Duration: 75,
				Machines: ["931e35e4-e28a-4ca3-b5b6-fc87625d346e"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-11T18:30:00Z",
				Duration: 15,
				Machines: ["e0833473-359f-4c65-9b6a-1f7f22375a71"],
			},
			{
				BookingUuid: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
				Name: "soSic",
				Start: "2025-04-11T18:45:00Z",
				Duration: 75,
				Machines: ["e0833473-359f-4c65-9b6a-1f7f22375a71"],
			},
		],
		machines: [
			{ Uuid: "012965ab-3e68-461d-83a9-625ccd636369", Name: "PC2" },
			{ Uuid: "2047347d-f2c6-4307-9881-1de6f32527ec", Name: "PC7" },
			{ Uuid: "21116719-3c0b-45f9-bc6c-12f70a245851", Name: "PC9" },
			{ Uuid: "32e486b1-4dc1-4462-940f-79415750eeb8", Name: "PC6" },
			{ Uuid: "535126d8-8cce-4cb4-a4bd-37055f2fbd4b", Name: "PC4" },
			{ Uuid: "53ae2066-0e22-467f-a9fe-38c7d6aa3a74", Name: "PC5" },
			{ Uuid: "68bc1314-17d4-4039-ac63-a5b4b198de7c", Name: "PC8" },
			{ Uuid: "931e35e4-e28a-4ca3-b5b6-fc87625d346e", Name: "PC10" },
			{ Uuid: "dfcd4bdc-7c57-475d-b486-b842dcf0a9ba", Name: "PC3" },
			{ Uuid: "e0833473-359f-4c65-9b6a-1f7f22375a71", Name: "PC1" },
		],
	};
	// try {
	// 	console.log("Fetching center info...");

	// 	const data = await Promise.all([
	// 		getCenterHours(),
	// 		getBookings(),
	// 		getAllMachines(),
	// 	]);

	// 	if (!data || !data[0] || !data[1] || !data[2]) {
	// 		console.log("data:", data);
	// 		throw new Error(`(500) Failed to fetch center info`);
	// 	}

	// 	const centerInfo = {
	// 		hours: data[0],
	// 		bookings: data[1],
	// 		machines: data[2],
	// 	};

	// 	return centerInfo;
	// } catch (error) {
	// 	console.error(error);
	// 	return null;
	// }
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

export async function createUser(
	signupData: SignupData
): Promise<UserUuid | null> {
	console.log("__createUser()__");

	const {
		username,
		password,
		firstName,
		lastName,
		studentNumber,
		studentEmail,
		dateOfBirth,
		discordId,
	} = signupData;

	const jwt = await getJWT();
	if (!jwt) {
		return null;
	}

	try {
		console.log(`Creating user '${username}...`);

		const response = await fetch(
			"https://api.ggleap.com/production/users/create",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
				body: JSON.stringify({
					User: {
						Username: username,
						FirstName: firstName,
						LastName: lastName,
						Password: password,
						Birthdate: new Date(dateOfBirth).toISOString(),
						Phone: null,
						PostPayLimit: 0,
						Notes: "",
						UserCustomFields: {
							"564f465e-ab82-4f63-9f0f-5d4a7197ea72": {
								FieldUuid: "564f465e-ab82-4f63-9f0f-5d4a7197ea72",
								FieldType: "String",
								FieldName: "Discord ID",
								WebAdmin: { Status: 0, AllowChangeStatus: false },
								Client: { Status: 0, AllowChangeStatus: false },
								IsDefault: false,
								SerializedValue: discordId,
							},
							"ea3dd434-a1fd-4fc1-bb37-fbdc43c9e94b": {
								FieldUuid: "ea3dd434-a1fd-4fc1-bb37-fbdc43c9e94b",
								FieldType: "String",
								FieldName: "Student Number",
								WebAdmin: { Status: 0, AllowChangeStatus: false },
								Client: { Status: 0, AllowChangeStatus: false },
								IsDefault: false,
								SerializedValue: studentNumber,
							},
						},
						PhotoUploadToken: null,
						Email: studentEmail,
						StudentId: null,
					},
				}),
			}
		);

		console.log("response:", response);
		const data = await response.json();
		if (!data.UserUuid || !response.ok) {
			console.log("data:", data);
			throw new Error(`(${response.status}) Failed to create user`);
		}

		console.log("UserUuid:", data.UserUuid);
		return data.UserUuid;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function createBooking(
	selectedTimeSlot: string,
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
		console.log("Checking if user has existing booking...");

		const bookings = await getBookings();
		if (bookings) {
			const hasExistingBooking = bookings.findLast(
				(booking) => {
					const isCurrentUser = booking.Name === session.user?.Username
					const bookingEnd = addMinutes(booking.Start, booking.Duration);
					const hasPassed = bookingEnd.getTime() < new Date().getTime();
					return isCurrentUser && !hasPassed;
				}
			);

			if (hasExistingBooking) {
				console.log("hasExistingBooking:", hasExistingBooking);
				throw new Error("User already has an ongoing/upcoming booking.");
			}
		}

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
						Start: selectedTimeSlot,
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
			throw new Error(`(${response.status}) Failed to create booking`);
		}

		console.log("BookingUuid:", data.BookingUuid);
		return data.BookingUuid;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function updateBookingDuration(
	duration: number
): Promise<BookingUuid | null> {
	console.log("__updateBookingDuration()__");

	const jwt = await getJWT();
	if (!jwt) {
		return null;
	}

	const session = await auth();
	if (!session?.user) {
		return null;
	}

	try {
		const bookings = await getBookings();
		if (!bookings) {
			return null;
		}

		const currentBooking = bookings.findLast(
			(booking) => {
				const isCurrentUser = booking.Name === session.user?.Username;
				const bookingStart = new Date(booking.Start);
				const bookingEnd = addMinutes(bookingStart, booking.Duration);
				const currentDate = new Date();
				const withinFinal15 = currentDate.getTime() >= new Date(bookingEnd.getTime() - 15 * 60 * 1000).getTime() && currentDate.getTime() < bookingEnd.getTime();
				return isCurrentUser && withinFinal15;
			}
		);

		if (!currentBooking) {
			console.log("No current booking within final 15 minutes.");
			return null;
		}

		const response = await fetch("https://api.ggleap.com/beta/bookings/update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: jwt,
			},
			body: JSON.stringify({
				BookingUuid: currentBooking.BookingUuid,
				Duration: duration,
			}),
		});

		const data = await response.json();
		if (!data.BookingUuid || !response.ok) {
			console.log("data:", data);
			throw new Error(`(${response.status}) Failed to update booking`);
		}

		console.log("Updated BookingUuid:", data.BookingUuid);
		//return data.BookingUuid;

		console.log("data:", data);
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}
