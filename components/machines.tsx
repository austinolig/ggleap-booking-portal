import { getMachines } from "@/lib/ggLeap";

export default async function Machines() {
	const data = await getMachines();

	if (!data) {
		return <p className="text-red-500">Unable to fetch machines.</p>;
	}

	return (
		<div className="p-4 border-1">
			<p className="font-bold">All Machines</p>
			{data.Machines.map((machine) => (
				<div key={machine.Uuid}>
					<p>
						{machine.Name} ({machine.Uuid})
					</p>
				</div>
			))}
		</div>
	);
}
