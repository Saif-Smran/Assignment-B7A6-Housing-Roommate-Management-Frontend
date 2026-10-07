import { NextResponse } from "next/server";
import { loginUser } from "@/api/auth.api";
import type { Role } from "@/interfaces";

const credentials: Record<Role, { email: string; password: string }> = {
  TENANT: {
    email: process.env.TESTER_TENANT_EMAIL || "testertenant@example.com",
    password: process.env.TESTER_TENANT_PASSWORD || "testertenant@1234",
  },
  OWNER: {
    email: process.env.TESTER_OWNER_EMAIL || "testerowner@example.com",
    password: process.env.TESTER_OWNER_PASSWORD || "testerowner@1234",
  },
  ADMIN: {
    email: process.env.TESTER_ADMIN_EMAIL || "testeradmin@example.com",
    password: process.env.TESTER_ADMIN_PASSWORD || "testeradmin@1234",
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
