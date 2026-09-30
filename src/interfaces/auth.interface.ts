import type { Role } from "./enums.interface";
import type { User } from "./user.interface";

export interface LoginPayload {
  email: string;
  password: string;
  role?: Role;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

export interface AuthResponseData {
  token?: string;
  accessToken?: string;
  user?: User;
}

export interface GoogleAuthPayload {
  idToken: string;
  role?: Role;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthLottieProps {
  type: "login" | "register";
}
