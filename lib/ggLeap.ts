import {
  JwtResponse,
  MachinesResponse,
  UserResponse,
  LoginRequest,
} from "./types/ggLeap";

export async function getJWT(): Promise<string> {
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

    const data = (await res.json()) as JwtResponse;

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
          Authorization: `${jwt}`,
        },
      }
    );

    const data = (await response.json()) as MachinesResponse;

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
