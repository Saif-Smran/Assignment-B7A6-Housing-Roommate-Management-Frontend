"use client";

import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAuthProvider from "./google-auth.provider";
import QueryProvider from "./query.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <TooltipProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3500}
            theme="colored"
          />
        </TooltipProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
}
