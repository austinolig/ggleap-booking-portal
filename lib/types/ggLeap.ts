// JWT
export type JwtResponse = string;

// Machines
export type MachinesResponse = {
	Machines: Machine[];
};

type Machine = {
	Uuid: string;
	Name: string;
};

// User
export type UserResponse = {
	User: UserProperties;
};

type UserProperties = {
	Email: string;
	FirstName: string;
	LastName: string;
	Username: string;
	Uuid: string;
	// GroupUuid?: string;
};

// Login Authentication
export type LoginRequest = {
	Username: string;
	Password: string;
	CenterUuid: string;
};
