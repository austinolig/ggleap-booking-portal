// PascalCase type properties to match the API response
// camelCase type properties for internal use

export type JWT = string;

export type CenterHours = {
	Regular: {
		[DayOfWeek: string]: {
			Open: string;
			Close: string;
		}[];
	};
	Special: {
		[Date: string]: {
			Open: string;
			Close: string;
		}[];
	};
};

export type BookingUuid = string;

export type Booking = {
	Start: string;
	Duration: number;
	Machines: string[];
	Name: string;
};

export type Machine = {
	Uuid: string;
	Name: string;
	Available?: boolean;
};

export type CenterInfo = {
	hours: CenterHours;
	bookings: Booking[];
	machines: Machine[];
};

export type TimeSlot = {
	time: Date;
	availablePCs: number;
};

export type UserUuid = string;

export type SignupData = {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	studentNumber: string;
	studentEmail: string;
	dateOfBirth: string;
	discordId: string;
};
