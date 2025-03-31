import { getCenterInfo } from "@/lib/ggLeap";

export async function GET() {
  try {
    const centerInfo = await getCenterInfo();

    if (!centerInfo) {
      throw new Error();
    }

    console.log("centerInfo:", centerInfo);

    return new Response(
      JSON.stringify({
        ...centerInfo,
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
