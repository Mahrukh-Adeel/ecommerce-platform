export type UserInfo = {
  id: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  token?: string;
  role?: "user" | "admin"; 
  isVerified?: boolean; 
  joinDate?: string; 
  avatar?: string;
  provider?: "local" | "google";
}