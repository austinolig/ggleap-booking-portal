import { getJWT } from "@/lib/ggLeap";

export async function GET() {
	console.log("__/api/auth/jwt/__");

	await getJWT();

	return new Response(null, {
		status: 204,
	});
}
