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

type TimeSlot = {
  Open: string;
  Close: string;
};

type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

type RegularHours = {
  [key in DayOfWeek]: TimeSlot[];
};

type SpecialHours = {
  [date: string]: TimeSlot[];
};

export type CenterHours = {
  Regular: RegularHours;
  Special: SpecialHours;
};
