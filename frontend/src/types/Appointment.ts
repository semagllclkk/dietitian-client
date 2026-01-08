export type Appointment = {
  id: number;
  appointmentDate: string;
  status: string;
  notes?: string;
  createdAt: string;
  dietitianId: number;
  clientId: number;
  dietitian?: {
    id: number;
    fullName: string;
    username: string;
  };
  client?: {
    id: number;
    fullName: string;
    username: string;
  };
};
