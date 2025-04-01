import { getCenterHours } from "@/lib/api/ggLeap";

export async function GET() {
  try {
    const centerHours = await getCenterHours();

    if (!centerHours) {
      throw new Error();
    }

    console.log("centerHours:", centerHours);

    return new Response(
      JSON.stringify({
        ...centerHours,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        message: "An error occurred while getting center information.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
