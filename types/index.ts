// PascalCase type properties to match the API response
// camelCase type properties for internal use

export type JWT = string;

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

export type BookingUuid = string;

export type Booking = {
  Start: string;
  Duration: number;
  Machines: string[];
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

export type ProcessedTimeSlots = Record<
  string,
  {
    availableMachinesCount: number;
    machineList: Machine[];
  }
>;

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
