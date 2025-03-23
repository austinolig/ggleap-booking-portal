import { getJWT } from "@/lib/ggLeap";

export async function GET() {
  console.log("__/api/auth/__");

  const jwt = await getJWT();

  return Response.json({ jwt });
}
