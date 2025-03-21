import getJWT from "@/lib/jwt";

export async function GET() {
  const jwt = await getJWT();

  return Response.json({ jwt });
}
