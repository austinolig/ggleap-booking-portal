import React from "react";
import { Input } from "./ui/input";

export default function InputWithIcon({
  icon,
  ...props
}: { icon: React.ReactNode } & React.ComponentProps<"input">) {
  return (
    <div className="relative flex items-center gap-2">
      <div className="absolute left-2 text-muted-foreground">{icon}</div>
      <Input className="pl-10" {...props} />
    </div>
  );
}
