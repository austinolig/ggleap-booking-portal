import React from "react";
import { Button } from "./ui/button";

export default function OptionButton({
  children,
  selected,
  ...props
}: {
  key: string;
  selected: boolean;
  children: React.ReactNode;
} & React.ComponentProps<"button">) {
  return (
    <Button
      className="h-auto cursor-pointer"
      variant="outline"
      style={
        selected
          ? {
              color: "var(--color-blue-500)",
              borderColor: "var(--color-blue-500)",
            }
          : undefined
      }
      {...props}
    >
      {children}
    </Button>
  );
}
