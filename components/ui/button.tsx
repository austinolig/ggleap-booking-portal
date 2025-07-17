import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
	{
		variants: {
			variant: {
				default:
					"bg-esports-gradient text-primary-foreground shadow-lg shadow-secondary/30 hover:brightness-120",
				destructive:
					"text-destructive shadow-xs focus-visible:ring-destructive/40 border-1 border-destructive/40 bg-destructive/5 hover:bg-destructive/10 hover:brightness-110 hover:shadow-lg hover:shadow-destructive/5",
				dropdown:
					"border border-input bg-input/30 text-foreground hover:bg-input/50",
				outline:
					"hover:bg-white/30 hover:shadow-lg hover:shadow-white/3",
				outlineSelected:
					"shadow-lg shadow-secondary/20 bg-esports-gradient text-primary",
				secondary:
					"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost:
					"hover:bg-input/50",
				link:
					"text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-[38px] px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-[58px] rounded-md px-6 has-[>svg]:px-4",
				icon: "size-12 rounded-full",
				// "absolute inset-[1px] bg-background/90",
				// "flex items-center justify-center rounded-full",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	children,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	if (variant === "default" || variant === "destructive") {
		return (
			<Comp
				data-slot="button"
				className={cn(buttonVariants({ variant, size, className }))}
				{...props}
			>
				{children}
			</Comp>
		);
	}

	return (
		<div
			className={cn(
				"relative rounded-md overflow-hidden bg-input pointer-events-none",
				buttonVariants({ variant, size, className }),
				props.disabled && "opacity-30"
			)}
		>
			<Comp
				data-slot="button"
				className={cn(
					"absolute flex items-center justify-center inset-[1px] rounded-md bg-background/90 pointer-events-auto cursor-pointer disabled:pointer-events-none",
					size === "icon" && "rounded-full"
				)}
				{...props}
			>
				{children}
			</Comp>
		</div>
	);
}

export { Button, buttonVariants };
