"use client";

import { ArrowRight, CheckCircle2, Receipt, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getMyPayments } from "@/api/payments.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Payment } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const token = getAuthToken() || undefined;
        const res = await getMyPayments(undefined, token);
        if (res.success && res.data?.items && res.data.items.length > 0) {
          // Latest payment
          setLatestPayment(res.data.items[0]);
        }
      } catch (err) {
        console.error("Failed to fetch payment status:", err);
      } finally {
        setLoading(false);
      }
    }
    void verify();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[75vh] flex-col items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg border-emerald-500/30 bg-card/90 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-600 p-1 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <Badge
            variant="outline"
            className="mb-3 border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          >
            Payment Verified
          </Badge>

          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your transaction has been securely processed by Stripe. Your tenancy
            application records have been updated.
          </p>

          <div className="my-6 w-full space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-4 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Gateway</span>
              <span className="font-semibold">Stripe Checkout (Test Mode)</span>
            </div>
            {sessionId && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Session Ref</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {sessionId.slice(0, 16)}...
                </span>
              </div>
            )}
            {latestPayment && (
              <>
                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                  <span className="text-muted-foreground">Payment Type</span>
                  <span className="font-semibold">
                    {latestPayment.paymentType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-emerald-600 text-sm">
                    {latestPayment.currency || "BDT"}{" "}
                    {latestPayment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="default"
                    className="bg-emerald-600 text-white text-[10px]"
                  >
                    {latestPayment.status}
                  </Badge>
                </div>
              </>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="flex-1 gap-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Link href="/dashboard/tenant/payments">
                <Receipt className="h-4 w-4" /> View Payment History
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2 rounded-2xl"
            >
              <Link href="/dashboard/tenant">
                Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
