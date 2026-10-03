"use client";

import { FileText, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getMyPayments } from "@/api/payments.api";
import {
  OwnerEmpty,
  OwnerPageHeader,
  OwnerStatus,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Payment } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function OwnerBillingPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPayments(
      {
        limit: 100,
        status: "COMPLETED",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      getAuthToken() || undefined,
    )
      .then((response) => {
        if (!response.success) {
          toast.error(response.message || "Unable to load completed payments.");
          return;
        }
        const completedPayments = response.data?.items ?? [];
        setPayments(completedPayments);
        setSelectedId(completedPayments[0]?.id ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedPayment = useMemo(
    () => payments.find((payment) => payment.id === selectedId),
    [payments, selectedId],
  );

  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="Tenant bills"
        description="Generate a printable bill from a completed tenant payment."
        action={
          <Button disabled={!selectedPayment} onClick={() => window.print()}>
            <Printer /> Print bill
          </Button>
        }
      />
      {loading ? (
        <div className="h-56 animate-pulse rounded-lg bg-muted" />
      ) : payments.length === 0 ? (
        <OwnerEmpty message="No completed tenant payments are available for billing." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle className="text-base">Completed payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {payments.map((payment) => (
                <button
                  type="button"
                  key={payment.id}
                  onClick={() => setSelectedId(payment.id)}
                  className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${selectedId === payment.id ? "border-indigo-500 bg-indigo-500/10" : "hover:bg-muted"}`}
                >
                  <span className="block font-medium">
                    {payment.paymentType} payment
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {payment.currency} {payment.amount.toLocaleString()} ·{" "}
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
          {selectedPayment && (
            <Card className="print:border-0 print:shadow-none">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <FileText className="mb-3 h-8 w-8 text-indigo-600" />
                    <CardTitle>Tenant payment bill</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Bill reference: {selectedPayment.id}
                    </p>
                  </div>
                  <OwnerStatus value={selectedPayment.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Tenant ID</p>
                    <p className="font-medium">{selectedPayment.userId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Application ID</p>
                    <p className="font-medium">
                      {selectedPayment.applicationId ?? "Not linked"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment date</p>
                    <p className="font-medium">
                      {new Date(selectedPayment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment type</p>
                    <p className="font-medium">{selectedPayment.paymentType}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-4 text-base">
                  <span className="font-medium">Total paid</span>
                  <span className="text-xl font-bold">
                    {selectedPayment.currency}{" "}
                    {selectedPayment.amount.toLocaleString()}
                  </span>
                </div>
                {selectedPayment.description && (
                  <p className="rounded-md bg-muted p-3 text-muted-foreground">
                    {selectedPayment.description}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  );
}
