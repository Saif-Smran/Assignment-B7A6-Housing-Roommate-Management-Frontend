import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto flex min-h-[75vh] flex-col items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg border-amber-500/30 bg-card/90 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-600 shadow-inner">
            <AlertCircle className="h-10 w-10" />
          </div>

          <Badge
            variant="outline"
            className="mb-3 border-amber-500/30 bg-amber-500/10 text-amber-600"
          >
            Payment Cancelled
          </Badge>

          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Checkout was not completed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You cancelled your Stripe payment session. No funds were debited
            from your card or account.
          </p>

          <div className="my-6 w-full rounded-2xl border border-border/60 bg-muted/30 p-4 text-left text-xs text-muted-foreground">
            <p>
              If this was an accident or you wish to use a different payment
              method, you can resume the payment at any time from your tenant
              payments portal.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="flex-1 gap-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Link href="/dashboard/tenant/payments">
                <RefreshCw className="h-4 w-4" /> Try Payment Again
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2 rounded-2xl"
            >
              <Link href="/dashboard/tenant">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
