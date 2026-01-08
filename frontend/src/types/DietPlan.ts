export type DietPlan = {
  id: number;
  title: string;
  description: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  notes?: string;
  status: string;
  createdAt: string;
  startDate: string;
  endDate: string;
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