import { getAllMachines } from "@/lib/ggLeap";

export default async function Machines() {
	const machines = await getAllMachines();

	if (!machines) {
		return <p className="text-red-500">No machines found.</p>;
	}

	return (
		<div className="p-4 border-1">
			<p className="font-bold">All Machines ({machines.length})</p>
			{machines.map((machine) => (
				<div key={machine.Uuid}>
					<p>
						{machine.Name} ({machine.Uuid})
					</p>
				</div>
			))}
		</div>
	);
}
