"use client";

import React, { useState } from "react";
import OptionButton from "./option-button";
import { Machine } from "@/types";

export default function MachineSelect({ machines }: { machines: Machine[] }) {
	const [selectedMachine, setSelectedMachine] = useState<Machine>(machines[0]);

	return (
		<div>
			{machines.map((machine) => (
				<OptionButton
					key={machine.Uuid}
					onClick={() => setSelectedMachine(machine)}
					selected={machine === selectedMachine}
				>
					{machine.Name} ({machine.Available ? "Available" : "Unavailable"})
				</OptionButton>
			))}
		</div>
	);
}
