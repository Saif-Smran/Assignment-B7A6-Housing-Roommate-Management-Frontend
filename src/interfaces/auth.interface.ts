import type { Role } from "./enums.interface";
import type { User } from "./user.interface";

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  role?: Role;
}

export interface AuthResponseData {
  token?: string;
  accessToken?: string;
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthLottieProps {
  type: "login" | "register";
}
