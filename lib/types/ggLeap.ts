export type Machine = {
	Uuid: string;
	Name: string;
};

export type JWT = string;

export type BookingUuid = string;

export type Booking = {
	Start: string;
	Duration: number;
	Machines: string[];
};
