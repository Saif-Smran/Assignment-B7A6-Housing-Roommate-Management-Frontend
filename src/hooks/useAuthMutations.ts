"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser, requestPasswordReset } from "@/api/auth";
import type { LoginPayload, RegisterPayload } from "@/interfaces";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
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
