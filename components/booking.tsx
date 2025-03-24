import { getAvailableMachines } from "@/lib/ggLeap";

export default async function Booking() {
	const data = await getAvailableMachines();

	if (!data) {
		return <p className="text-red-500">Unable to fetch available machines</p>;
	}

	return (
		<div className="p-4 border-1">
			<p className="font-bold">Available Machines ({data.Machines.length})</p>
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
