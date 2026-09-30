import type { AuthProvider, Role } from "./enums.interface";

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  fullName: string;
  phone: string | null;
  profileImage: string | null;
  provider: AuthProvider;
  role: Role;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
