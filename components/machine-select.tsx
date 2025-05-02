"use client";

import { Machine } from "@/types";
import { useSelectionStore } from "@/stores";
import { Button } from "./ui/button";

export default function MachineSelect({ machines }: { machines: Machine[] }) {
	const selectedMachine = useSelectionStore((state) => state.selectedMachine);
	const setSelectedMachine = useSelectionStore(
		(state) => state.setSelectedMachine
	);
	return (
		<div>
			<p>PC ({selectedMachine?.Name})</p>
			<div>
				{machines.map((machine) => (
					<Button
						key={machine.Uuid}
						onClick={() => setSelectedMachine(machine)}
						variant={
							machine.Uuid === selectedMachine?.Uuid
								? "outlineSelected"
								: "outline"
						}
						disabled={!machine.Available}
					>
						{machine.Name}
					</Button>
				))}
			</div>
		</div>
	);
}
