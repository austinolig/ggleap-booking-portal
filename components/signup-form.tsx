"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/actions";
import { useState } from "react";
import {
	CalendarIcon,
	Gamepad2,
	Hash,
	KeyRound,
	LoaderCircle,
	Mail,
	User,
} from "lucide-react";
import { useFormStatus } from "react-dom";
import FormInput from "./form-input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format, getYear, subYears } from "date-fns";

export default function SignupForm() {
	const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
	const [error, setError] = useState("");
	const handleSubmit = async (formData: FormData) => {
		const error = await signUp(formData);
		if (error) {
			setError(error); // TODO: display error from api response
			setDateOfBirth(undefined);
		}
	};

	return (
		<form action={handleSubmit}>
			<div className="flex flex-col gap-6">
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<FormInput
					icon={<User />}
					id="username"
					name="username"
					type="text"
					placeholder="Username*"
					maxLength={30}
					required
				/>
				<FormInput
					icon={<KeyRound />}
					id="password"
					name="password"
					type="password"
					placeholder="Password*"
					maxLength={30}
					required
				/>
				<FormInput
					icon={<User />}
					id="firstName"
					name="firstName"
					type="text"
					placeholder="First Name*"
					maxLength={30}
					required
				/>
				<FormInput
					icon={<User />}
					id="lastName"
					name="lastName"
					type="text"
					placeholder="Last Name*"
					maxLength={30}
					required
				/>
				<FormInput
					icon={<Hash />}
					id="studentNumber"
					name="studentNumber"
					type="text"
					placeholder="Student Number*"
					maxLength={9}
					inputMode="numeric"
					pattern="[0-9]*"
					title="Must only contain numbers."
					required
				/>
				<FormInput
					icon={<Mail />}
					id="studentEmail"
					name="studentEmail"
					type="email"
					placeholder="Student Email*"
					pattern=".+@ontariotechu\.net"
					title="Must use a valid @ontariotechu.net email address."
					required
				/>
				<Popover>
					<PopoverTrigger asChild>
						<button
							className={cn(
								"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-[5px] text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
								"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
								"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
								"relative flex items-center cursor-pointer",
								"pl-11"
							)}
						>
							<div className="absolute left-3 text-muted-foreground">
								<CalendarIcon />
							</div>
							{dateOfBirth ? (
								format(dateOfBirth, "MMM dd, yyyy")
							) : (
								<span className="text-muted-foreground">Date of Birth*</span>
							)}
							<div>
								<label htmlFor={"dateOfBirth"} className="sr-only">
									Date of Birth
								</label>
								<input
									className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
									id="dateOfBirth"
									name="dateOfBirth"
									type="text"
									value={dateOfBirth ? format(dateOfBirth, "MMM dd, yyyy") : ""}
									onChange={() => {}}
									tabIndex={-1}
									required
								/>
							</div>
						</button>
					</PopoverTrigger>
					<PopoverContent
						onOpenAutoFocus={(e) => {
							e.preventDefault();
						}}
						className="w-auto p-0"
						align="start"
					>
						<Calendar
							captionLayout="dropdown"
							fromYear={getYear(subYears(new Date(), 100))}
							toYear={getYear(new Date())}
							mode="single"
							initialFocus
							selected={dateOfBirth}
							onSelect={setDateOfBirth}
							disabled={(date: Date) => date > new Date()}
						/>
					</PopoverContent>
				</Popover>
				<FormInput
					icon={<Gamepad2 />}
					id="discordId"
					name="discordId"
					type="text"
					placeholder="Discord ID"
					maxLength={30}
				/>
				<CreateAccountButton />
			</div>
		</form>
	);
}

function CreateAccountButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" className="w-full cursor-pointer" disabled={pending}>
			{pending && <LoaderCircle className="animate-spin" />}
			<span>Create Account</span>
		</Button>
	);
}
