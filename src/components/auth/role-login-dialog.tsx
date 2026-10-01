"use client";

import { Building2, Loader2, ShieldCheck, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useDemoLoginMutation } from "@/hooks/useAuthMutations";
import type { AuthResponseData, Role } from "@/interfaces";
import { getDashboardPath, setAuthToken } from "@/lib/auth";

const roles: {
  value: Role;
  label: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    value: "TENANT",
    label: "Tenant",
    description: "Browse rooms and manage applications",
    icon: UserRound,
  },
  {
    value: "OWNER",
    label: "Owner",
    description: "List properties and manage tenants",
    icon: Building2,
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Review and manage the platform",
    icon: ShieldCheck,
  },
];

function completeLogin(
  response: AuthResponseData,
  role: Role,
  router: ReturnType<typeof useRouter>,
) {
  const user = response.user || {
    id: `demo-${Date.now()}`,
    email: `${role.toLowerCase()}-demo`,
    fullName: `${role} Demo`,
    role,
  };
  setAuthToken(
    response.token || response.accessToken || `demo-session-${Date.now()}`,
    user,
  );
  toast.success(`Signed in as ${user.fullName || role}.`);
  router.push(getDashboardPath(user.role));
}

export function RoleLoginDialog({ onOpen }: { onOpen?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const demoLoginMutation = useDemoLoginMutation();

  const close = () => {
    if (!demoLoginMutation.isPending) {
      setOpen(false);
      setSelectedRole(null);
    }
  };

  const chooseRole = (role: Role) => {
    setSelectedRole(role);
    demoLoginMutation.mutate(role, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          completeLogin(response.data, role, router);
          return;
        }
        toast.error(
          response.message || "Unable to sign in with this demo account.",
        );
      },
      onError: (error) =>
        toast.error(
          error.message || "Unable to sign in with this demo account.",
        ),
      onSettled: () => {
        setOpen(false);
        setSelectedRole(null);
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => {
          onOpen?.();
          setOpen(true);
        }}
        className="gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-medium text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-purple-700"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        One-Click Role Login
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-login-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Demo access
                </p>
                <h2
                  id="role-login-title"
                  className="mt-1 font-heading text-xl font-bold"
                >
                  Which role would you like?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose an account and we will sign you in with its configured
                  tester credentials.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={close}
                aria-label="Close role login"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 space-y-2">
              {roles.map(({ value, label, description, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => chooseRole(value)}
                  disabled={demoLoginMutation.isPending}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/5 disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                    {selectedRole === value ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={demoLoginMutation.isPending}
              className="mt-5 w-full rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
