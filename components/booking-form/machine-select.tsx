import { Machine } from "@/types";
import { Button } from "../ui/button";
import { memo } from "react";
import { PcCase } from "lucide-react";

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
			<p className="font-bold justify-center text-muted-foreground flex items-center gap-2">
				<PcCase />
				<span>PC (
					<span className="text-foreground">
						{selectedMachine ? selectedMachine.Name : "PCX"}
					</span>
					)
				</span>
			</p>
			{machines.length > 0 ? (
				<div className="grid grid-cols-3 gap-3">
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
