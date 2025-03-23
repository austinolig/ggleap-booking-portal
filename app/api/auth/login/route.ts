import { login } from "@/lib/ggLeap";

export async function POST(request: Request) {
  console.log("__/api/auth/login__");

  try {
    const { username, password } = await request.json();

    const userData = await login(username, password);

    console.log("User:", userData);

    if (!userData) {
      throw new Error();
    }

    return new Response(
      JSON.stringify({ message: `Logged in as '${userData.User.Username}'` }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({ message: "An error occurred during login." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
