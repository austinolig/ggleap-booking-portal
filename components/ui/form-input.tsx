import React from "react";
import { Label } from "./label";
import { Input } from "./input";

export default function FormInput({
	icon,
	...props
}: { icon: React.ReactNode } & React.ComponentProps<"input">) {
	const { name, placeholder } = props;
	return (
		<>
			<Label htmlFor={name} className="sr-only">
				{placeholder}
			</Label>
			<div className="relative flex items-center">
				<div className="absolute left-3 text-muted-foreground">{icon}</div>
				<Input className="pl-11" {...props} />
			</div>
		</>
	);
}
