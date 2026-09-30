import { NextResponse } from "next/server";
import { loginUser } from "@/api/auth.api";
import type { Role } from "@/interfaces";

const credentials: Record<Role, { email?: string; password?: string }> = {
  TENANT: {
    email: process.env.TESTER_TENANT_EMAIL,
    password: process.env.TESTER_TENANT_PASSWORD,
  },
  OWNER: {
    email: process.env.TESTER_OWNER_EMAIL,
    password: process.env.TESTER_OWNER_PASSWORD,
  },
  ADMIN: {
    email: process.env.TESTER_ADMIN_EMAIL,
    password: process.env.TESTER_ADMIN_PASSWORD,
  },
};

export async function POST(request: Request) {
  const body = (await request.json()) as { role?: Role };
  const role = body.role;
  const account = role ? credentials[role] : undefined;

  if (!account?.email || !account.password) {
    return NextResponse.json(
      {
        success: false,
        message: "Demo account is not configured.",
        data: null,
      },
      { status: 500 },
    );
  }

  const response = await loginUser({
    email: account.email,
    password: account.password,
  });
  return NextResponse.json(response, { status: response.success ? 200 : 401 });
}
