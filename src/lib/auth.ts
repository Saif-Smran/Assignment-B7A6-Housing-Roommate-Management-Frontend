import type { Role } from "@/interfaces";

export function getDashboardPath(role?: Role | string | null): string {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return "/dashboard/admin";
    case "OWNER":
      return "/dashboard/owner";
    default:
      return "/dashboard/tenant";
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken");

  if (token && token.trim() !== "") return true;

  const cookies = document.cookie || "";
  return (
    cookies.includes("token=") ||
    cookies.includes("accessToken=") ||
    cookies.includes("authToken=")
  );
}

export function setAuthToken(token: string, user?: unknown): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("accessToken", token);
  localStorage.setItem("token", token);
  localStorage.setItem("authToken", token);

  // Set cookie for 7 days
  const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
  document.cookie = `accessToken=${token}; path=/; expires=${expires}; SameSite=Lax`;
  document.cookie = `token=${token}; path=/; expires=${expires}; SameSite=Lax`;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    const role = (user as { role?: string })?.role;
    if (role) {
      document.cookie = `role=${role}; path=/; expires=${expires}; SameSite=Lax`;
    }
  }

  window.dispatchEvent(new Event("auth-state-changed"));
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
}

export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as T;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.dispatchEvent(new Event("auth-state-changed"));
}
