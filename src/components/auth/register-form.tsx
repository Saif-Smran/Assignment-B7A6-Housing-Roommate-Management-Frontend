"use client";

import { GoogleLogin } from "@react-oauth/google";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthLottie } from "@/components/auth/auth-lottie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGoogleAuthMutation,
  useRegisterMutation,
} from "@/hooks/useAuthMutations";
import type { AuthResponseData, Role } from "@/interfaces";
import { getDashboardPath, setAuthToken } from "@/lib/auth";
import { registerSchema } from "@/validation";

function completeRegistration(
  response: AuthResponseData,
  email: string,
  fullName: string,
  role: Role,
  router: ReturnType<typeof useRouter>,
) {
  const user = response.user || {
    id: `user-${Date.now()}`,
    email,
    fullName,
    role,
  };
  setAuthToken(
    response.token || response.accessToken || `session-${Date.now()}`,
    user,
  );
  toast.success(`Welcome to UrbanMatch, ${fullName}!`);
  router.push(getDashboardPath(user.role));
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>("TENANT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState("");
  const registerMutation = useRegisterMutation();
  const googleMutation = useGoogleAuthMutation();

  useEffect(() => {
    const requestedRole = searchParams.get("role");
    if (requestedRole === "OWNER" || requestedRole === "LANDLORD")
      setRole("OWNER");
    if (requestedRole === "TENANT") setRole("TENANT");
  }, [searchParams]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const result = registerSchema.safeParse({
      fullName,
      email,
      phone,
      role,
      password,
      confirmPassword,
      agreeTerms,
    });
    if (!result.success) {
      const message =
        result.error.issues[0]?.message || "Please check the form.";
      setError(message);
      toast.error(message);
      return;
    }
    registerMutation.mutate(
      { fullName, email, phone, password, role },
      {
        onSuccess: (response) =>
          response.success && response.data
            ? completeRegistration(response.data, email, fullName, role, router)
            : setError(response.message || "Unable to create your account."),
        onError: (mutationError) =>
          setError(mutationError.message || "Unable to create your account."),
      },
    );
  };

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
      <div className="order-2 w-full lg:order-1 lg:col-span-7">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="space-y-2 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Join UrbanMatch
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your role and start finding your next place.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("TENANT")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-semibold ${role === "TENANT" ? "border-indigo-500 bg-indigo-500/10 text-indigo-600" : "border-border text-muted-foreground"}`}
            >
              <Users className="h-4 w-4" />
              Tenant
            </button>
            <button
              type="button"
              onClick={() => setRole("OWNER")}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3 text-xs font-semibold ${role === "OWNER" ? "border-indigo-500 bg-indigo-500/10 text-indigo-600" : "border-border text-muted-foreground"}`}
            >
              <Building2 className="h-4 w-4" />
              Owner
            </button>
          </div>
          {error && (
            <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </p>
          )}
          <form onSubmit={submit} className="mt-5 space-y-4 text-left">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="register-name"
                  className="text-xs font-semibold"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Jane Doe"
                    className="h-11 rounded-2xl pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="register-phone"
                  className="text-xs font-semibold"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+1 555 000 0000"
                    className="h-11 rounded-2xl pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-xs font-semibold">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@domain.com"
                  className="h-11 rounded-2xl pl-10"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="text-xs font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className="h-11 rounded-2xl px-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="register-confirm"
                  className="text-xs font-semibold"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="register-confirm"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat password"
                    className="h-11 rounded-2xl pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) => setAgreeTerms(event.target.checked)}
                className="mt-0.5"
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="h-11 w-full rounded-2xl bg-indigo-600 text-white"
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Create {role === "OWNER" ? "owner" : "tenant"} account{" "}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or register with
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={({ credential }) => {
                if (credential)
                  googleMutation.mutate(
                    { idToken: credential, role },
                    {
                      onSuccess: (response) =>
                        response.success && response.data
                          ? completeRegistration(
                              response.data,
                              email || "google-user",
                              fullName || "Google User",
                              role,
                              router,
                            )
                          : toast.error(
                              response.message || "Google sign up failed.",
                            ),
                      onError: (mutationError) =>
                        toast.error(
                          mutationError.message || "Google sign up failed.",
                        ),
                    },
                  );
              }}
              onError={() => toast.error("Google sign up was cancelled.")}
            />
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div className="order-1 hidden h-full lg:order-2 lg:col-span-5 lg:block">
        <AuthLottie type="register" />
      </div>
    </div>
  );
}
