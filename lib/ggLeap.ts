import {
	MachinesResponse,
	UserResponse,
	LoginRequest,
	JwtResponse,
} from "./types/ggLeap";

export async function getJWT(): Promise<JwtResponse> {
	console.log("__getJWT()__");

	try {
		console.log("Fetching JWT...");

		const res = await fetch(
			"https://api.ggleap.com/production/authorization/public-api/auth",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ AuthToken: process.env.GGLEAP_API_TOKEN }),
				cache: "force-cache",
				next: { revalidate: 300 },
			}
		);

		if (!res.ok) {
			throw new Error(`Failed to fetch JWT: ${res.status}`);
		}

		const data = await res.json();

		console.log(`JWT: ${data.Jwt}`);

		return data.Jwt;
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

		console.log("getMachines().JWT:", jwt);

		const response = await fetch(
			"https://api.ggleap.com/production/machines/get-all",
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `${jwt}`,
				},
			}
		);

		// debugging
		// const data = (await response.json()) as MachinesResponse;
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

export async function getAvailableMachines(): Promise<MachinesResponse | null> {
	console.log("__getAvailableMachines()__");

	const jwt = await getJWT();

	try {
		const response = await fetch(
			"https://api.ggleap.com/production/bookings/get-available-machines",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `${jwt}`,
				},
				body: JSON.stringify({
					Start: "2025-03-24T14:00:00Z",
					Duration: 90,
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

export async function createBooking(): Promise<any> {
	// machineUuid: string,
	// start: string,
	// duration: number
	console.log("__createBooking()__");

	const jwt = await getJWT();

	// const options = {
	// 	method: 'POST',
	// 	headers: {'Content-Type': 'application/json'},
	// 	body: '{"Booking":{"GamePassCoupons":{"Quantity":0,"OfferUuid":"string","GamePassName":"string","TotalSeconds":0,"CouponStartDate":"2019-08-24T14:15:22Z","CouponExpirationDate":"2019-08-24T14:15:22Z","EligibleDateFrom":"2019-08-24T14:15:22Z","EligibleDateTo":"2019-08-24T14:15:22Z"},"Name":"string","Start":"string","Duration":1,"Machines":["string"],"UserUuid":"string","GuestName":"string","BookerEmail":"user@example.com","BookerPhone":"string","Color":"#aabbcc","AdditionalInfo":"string","Otp":"string","ShouldLockPc":true,"TaxesIncludedInPrices":true,"Metadata":{"property1":"string","property2":"string"}}}'
	//   };

	//   fetch('https://api.ggleap.com/beta/bookings/create', options)
	// 	.then(response => response.json())
	// 	.then(response => console.log(response))
	// 	.catch(err => console.error(err));

	try {
		const response = await fetch(
			"https://api.ggleap.com/production/bookings/create",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `${jwt}`,
					"X-Correlation-Id": `abed00e7-f2fa-464e-9467-2788673be40b`,
				},
				body: JSON.stringify({
					Booking: {
						Name: "soSic",
						Machines: ["e0833473-359f-4c65-9b6a-1f7f22375a71"],
						Start: "2025-03-24T14:00:00Z",
						Duration: "90",
						OTP: "1234",
					},
				}),
			}
		);

		const data = await response.text();

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
