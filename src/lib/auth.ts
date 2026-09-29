export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("user") ||
    localStorage.getItem("authToken");

  if (token && token.trim() !== "") return true;

  const cookies = document.cookie || "";
  return (
    cookies.includes("token=") ||
    cookies.includes("accessToken=") ||
    cookies.includes("authToken=") ||
    cookies.includes("user=")
  );
}
