interface JwtResponse {
  Jwt: string;
}

export default async function getJWT(): Promise<string> {
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
