import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<main className="text-center space-y-6">
			<div>
				<h2 className="text-6xl font-bold">404</h2>
				<p className="text-muted-foreground">
					Page not found.
				</p>
			</div>
			<Button asChild variant="default">
				<Link href="/">
					<ArrowLeft />
					<span>Go Home</span>
				</Link>
			</Button>
		</main>
	);
}
