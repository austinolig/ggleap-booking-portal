import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function LogInButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			className="flex items-center gap-4"
			disabled={pending}
		>
			{pending && <LoaderCircle className="animate-spin" />}
			<span>Log In</span>
		</button>
	);
}
