import { Machine } from "@/types";
import { Button } from "../ui/button";
import { memo } from "react";

export default memo(function MachineSelect({
	machines,
	selectedMachine,
	setSelectedMachine,
}: {
	machines: Machine[];
	selectedMachine: Machine | null;
	setSelectedMachine: (machine: Machine) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			{/* display number of available machines instead? */}
			<p className="font-bold text-muted-foreground">
				PC ({selectedMachine ? selectedMachine.Name : "PCX"})
			</p>
			{machines.length > 0 ? (
				<div className="grid grid-cols-2 gap-3">
					{machines.map((machine) => {
						const isSelected = machine.Uuid === selectedMachine?.Uuid;
						const isDisabled = !machine.Available;
						return (
							<Button
								key={machine.Uuid}
								onClick={() => setSelectedMachine(machine)}
								variant={isSelected ? "outlineSelected" : "outline"}
								disabled={isDisabled}
							>
								{machine.Name}
							</Button>
						);
					})}
				</div>
			) : (
				<p>No PCs available.</p>
			)}
		</div>
	);
});
