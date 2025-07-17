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
				cache: "force-cache",
				next: { revalidate: 60 },
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

		const dateQuery = format(new Date(), "yyyy-MM-dd");

		console.log("Current date:", new Date());
		console.log("dateQuery:", dateQuery);

		const response = await fetch(
			`https://api.ggleap.com/production/bookings/get-bookings?Date=${dateQuery}&Days=2`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
				cache: "force-cache",
				next: { revalidate: 30 },
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
				cache: "force-cache",
				next: { revalidate: 60 },
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

	try {
		console.log("Fetching center info...");

		const data = await Promise.all([
			getCenterHours(),
			getBookings(),
			getAllMachines(),
		]);

		if (!data || !data[0] || !data[1] || !data[2]) {
			console.log("data:", data);
			throw new Error(`(500) Failed to fetch center info`);
		}

		const centerInfo = {
			hours: data[0],
			bookings: data[1],
			machines: data[2],
		};

		return centerInfo;
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
	selectedTimeSlot: Date,
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
						Start: selectedTimeSlot.toISOString(),
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
				const bookingEnd = addMinutes(booking.Start, booking.Duration);
				const currentDate = new Date();
				const withinFinal15 = currentDate.getTime() >= new Date(bookingEnd.getTime() - 15 * 60 * 1000).getTime() && currentDate.getTime() < bookingEnd.getTime();
				return isCurrentUser && withinFinal15;
			}
		);

		if (!currentBooking) {
			console.log("No current booking within final 15 minutes.");
			return null;
		}

		const response = await fetch("https://api.ggleap.com/production/bookings/update", {
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

export async function deleteBooking(
	bookingUuid: BookingUuid
): Promise<boolean> {
	console.log("__deleteBooking()__");

	const jwt = await getJWT();
	if (!jwt) {
		return false;
	}

	try {
		console.log(`Deleting booking "${bookingUuid}"...`);

		const response = await fetch(
			"https://api.ggleap.com/production/bookings/delete",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: jwt,
				},
				body: JSON.stringify({ BookingUuid: bookingUuid }),
			}
		);

		if (!response.ok) {
			console.log("Response status:", response.status);
			throw new Error(`(${response.status}) Failed to delete booking`);
		}

		console.log("Booking deleted successfully.");
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function getUserBooking(): Promise<Booking | undefined> {
	const session = await auth();
	if (!session?.user) {
		return undefined;
	}

	const bookings = await getBookings();
	if (!bookings) {
		return undefined;
	}

	return bookings.findLast((booking) => {
		const isCurrentUser = booking.Name === session.user?.Username;
		const bookingEnd = addMinutes(booking.Start, booking.Duration);
		return isCurrentUser && bookingEnd.getTime() > new Date().getTime();
	});
}

