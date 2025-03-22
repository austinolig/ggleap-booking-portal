import getJWT from "@/lib/jwt";

interface Machine {
  Uuid: string;
  Name: string;
}

interface MachinesResponse {
  Machines: Machine[];
}

async function getMachines(): Promise<MachinesResponse | null> {
  const jwt = await getJWT();

  console.log("Fetching machines...");

  try {
    const res = await fetch(
      "https://api.ggleap.com/production/machines/get-all",
      {
        headers: {
          Authorization: `${jwt}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch machines: ${res.status}`);
    }

    const data = (await res.json()) as MachinesResponse;

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export default async function Machines() {
  const data = await getMachines();

  if (!data) {
    return <p className="text-red-500">Unable to fetch machines.</p>;
  }

  return (
    <div className="p-4 border-1">
      <p className="font-bold">All Machines</p>
      {data.Machines.map((machine: Machine) => (
        <div key={machine.Uuid}>
          <p>
            {machine.Name} ({machine.Uuid})
          </p>
        </div>
      ))}
    </div>
  );
}
