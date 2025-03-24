import { getJWT } from "@/lib/ggLeap";

export async function GET() {
  console.log("__/api/auth/__");

  try {
    await getJWT();

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("JWT refresh error:", error);

    return new Response(null, {
      status: 204,
    });
  }
}
