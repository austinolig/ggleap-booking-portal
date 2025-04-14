import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
        <div className="absolute left-2 text-muted-foreground">{icon}</div>
        <Input className="pl-10" {...props} />
      </div>
    </>
  );
}
