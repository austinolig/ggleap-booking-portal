type JwtResponse = {
	Jwt: string;
};

export async function getJWT(): Promise<string> {
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

		const data = (await res.json()) as JwtResponse;

		console.log(`JWT: ${data.Jwt}`);

		return data.Jwt;
	} catch (error) {
		console.error(error);

		return "";
	}
}

type Machine = {
	Uuid: string;
	Name: string;
};

type MachinesResponse = {
	Machines: Machine[];
};

export async function getMachines(): Promise<MachinesResponse | null> {
	const jwt = await getJWT();

	console.log("Fetching machines...");

	try {
		const response = await fetch(
			"https://api.ggleap.com/production/machines/get-all",
			{
				headers: {
					Authorization: `${jwt}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`(${response.status}) Failed to fetch machines`);
		}

		const data = (await response.json()) as MachinesResponse;

		console.log(data);

		return data;
	} catch (error) {
		console.error(error);

		return null;
	}
}

type UserProperties = {
	Email: string;
	FirstName: string;
	LastName: string;
	Username: string;
	Uuid: string;
	// 	// GroupUuid:  "998e51c1-577e-4845-b469-473c60f63bff" (player group?)
};

type User = {
	User: UserProperties;
};

export async function login(
	username: string,
	password: string
): Promise<User | null> {
	try {
		console.log(`Logging in '${username}'...`);

		const centerUuid = "50dd0be4-13eb-4db3-94b3-09e3062fa2d9";

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

		console.log(data);

		if (!response.ok) {
			throw new Error(`(${response.status}) Failed to login`);
		}

		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
