import { getJWT } from "@/lib/ggLeap";

export async function GET() {
	const jwt = await getJWT();

	return Response.json({ jwt });
}
