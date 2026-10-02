"use client";

import { Banknote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getMyPayments } from "@/api/payments.api";
import {
  OwnerEmpty,
  OwnerPageHeader,
  OwnerStatus,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Payment } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function OwnerEarningsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMyPayments(
      { limit: 100, sortBy: "createdAt", sortOrder: "desc" },
      getAuthToken() || undefined,
    )
      .then((response) => {
        if (response.success) setPayments(response.data?.items ?? []);
        else toast.error(response.message || "Unable to load earnings.");
      })
      .finally(() => setLoading(false));
  }, []);
  const completed = useMemo(
    () => payments.filter((payment) => payment.status === "COMPLETED"),
    [payments],
  );
  const total = completed.reduce((sum, payment) => sum + payment.amount, 0);
  const byType = completed.reduce<Record<string, number>>(
    (summary, payment) => {
      summary[payment.paymentType] =
        (summary[payment.paymentType] ?? 0) + payment.amount;
      return summary;
    },
    {},
  );
  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="Earnings"
        description="Review completed payments and revenue by payment type."
      />
      {loading ? (
        <div className="h-56 animate-pulse rounded-lg bg-muted" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Completed revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                BDT {total.toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Completed payments
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {completed.length}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Payment types
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {Object.keys(byType).length}
              </CardContent>
            </Card>
          </div>
          {payments.length === 0 ? (
            <OwnerEmpty message="Payment activity will appear here after tenants complete checkout." />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-indigo-600" /> Payment
                  history
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Transaction</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="p-3">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">{payment.paymentType}</td>
                        <td className="p-3 font-medium">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {payment.transactionId ?? "Pending"}
                        </td>
                        <td className="p-3">
                          <OwnerStatus value={payment.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </section>
  );
}
