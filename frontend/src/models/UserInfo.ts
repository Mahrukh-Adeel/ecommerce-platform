export type UserInfo = {
  id: string;
  email: string;
  name: string;
  address?: string;
  token?: string;
  role?: "user" | "admin"; 
  isVerified?: boolean; 
  joinDate?: string; 
}