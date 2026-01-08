export type User = {
  id: number;
  username: string;
  fullName: string;
  role: string;
  email?: string;
  phone?: string;
  accessToken: string;
};