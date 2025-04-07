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

type RegularHours = {
  [DayOfWeek: string]: TimeSlot[];
};

type SpecialHours = {
  [Date: string]: TimeSlot[];
};

export type CenterHours = {
  Regular: RegularHours;
  Special: SpecialHours;
};

export type TimeAndAvailableMachines = {
  time: Date;
  availableMachines: number;
};

export type CenterInfo = {
  hours: CenterHours;
  bookings: Booking[];
  machines: Machine[];
};
