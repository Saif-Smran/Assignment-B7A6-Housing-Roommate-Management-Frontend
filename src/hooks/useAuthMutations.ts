"use client";

import { useMutation } from "@tanstack/react-query";
import {
  demoLogin,
  googleAuth,
  loginUser,
  registerUser,
  requestPasswordReset,
} from "@/api/auth.api";
import type {
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
} from "@/interfaces";

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      loginUser({ email, password }),
  });
}

export function useGoogleAuthMutation() {
  return useMutation({
    mutationFn: (payload: GoogleAuthPayload) => googleAuth(payload),
  });
}

export function useDemoLoginMutation() {
  return useMutation({
    mutationFn: (role: import("@/interfaces").Role) => demoLogin(role),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  });
}
