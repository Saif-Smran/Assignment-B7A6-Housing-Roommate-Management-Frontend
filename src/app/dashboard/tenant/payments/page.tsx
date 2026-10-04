"use client";

import { CreditCard, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyApplications } from "@/api/applications.api";
import { getMyPayments, initiatePayment } from "@/api/payments.api";
import { getRoomById } from "@/api/properties.api";
import {
  TenantEmpty,
  TenantPageHeader,
  tenantSectionClass,
  tenantStatusVariant,
} from "@/components/tenant/tenant-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Application, Payment, PaymentType, Room } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

type ApprovedApplication = { application: Application; room: Room };
export default function TenantPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [approved, setApproved] = useState<ApprovedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState("");
  const token = getAuthToken() || undefined;
  useEffect(() => {
    async function load() {
      const [paymentsResponse, applicationsResponse] = await Promise.all([
        getMyPayments(
          { limit: 100, sortBy: "createdAt", sortOrder: "desc" },
          token,
        ),
        getMyApplications(token),
      ]);
      if (paymentsResponse.success)
        setPayments(paymentsResponse.data?.items ?? []);
      else toast.error(paymentsResponse.message || "Unable to load payments.");
      if (applicationsResponse.success) {
        const results = await Promise.all(
          (applicationsResponse.data?.items ?? [])
            .filter((application) => application.status === "APPROVED")
            .map(async (application) => ({
              application,
              response: await getRoomById(application.roomId, token),
            })),
        );
        setApproved(
          results.flatMap(({ application, response }) =>
            response.success && response.data
              ? [{ application, room: response.data }]
              : [],
          ),
        );
      } else
        toast.error(
          applicationsResponse.message ||
            "Unable to load approved applications.",
        );
      setLoading(false);
    }
    void load();
  }, [token]);
  async function pay(application: Application, room: Room, type: PaymentType) {
    const amount =
      type === "DEPOSIT"
        ? (room.securityDeposit ?? room.rentAmount)
        : room.rentAmount;
    const key = `${application.id}-${type}`;
    setPaying(key);
    const origin = window.location.origin;
    const response = await initiatePayment(
      {
        applicationId: application.id,
        amount,
        paymentType: type,
        description:
          type === "DEPOSIT"
            ? "Security deposit payment via Stripe gateway"
            : "Monthly rent payment via Stripe gateway",
        successUrl: `${origin}/payment/success`,
        cancelUrl: `${origin}/payment/cancel`,
      },
      token,
    );
    if (!response.success || !response.data?.checkoutUrl) {
      toast.error(response.message || "Unable to start payment.");
      setPaying("");
      return;
    }
    window.location.assign(response.data.checkoutUrl);
  }
  return (
    <section className={tenantSectionClass}>
      <TenantPageHeader
        title="Payments"
        description="Review payment history and pay approved rent or deposits."
      />
      {loading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-indigo-600" /> Approved payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approved.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No approved applications are ready for payment.
                </p>
              ) : (
                <div className="space-y-3">
                  {approved.map(({ application, room }) => (
                    <div
                      key={application.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">
                          Room {room.roomNumber || room.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rent: BDT {room.rentAmount.toLocaleString()} ·
                          Deposit: BDT{" "}
                          {(
                            room.securityDeposit ?? room.rentAmount
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={Boolean(paying)}
                          onClick={() => void pay(application, room, "RENT")}
                        >
                          <CreditCard />{" "}
                          {paying === `${application.id}-RENT`
                            ? "Starting..."
                            : "Pay rent"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={Boolean(paying)}
                          onClick={() => void pay(application, room, "DEPOSIT")}
                        >
                          Pay deposit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payment history</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <TenantEmpty message="No payment history yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-175 text-left text-sm">
                    <thead className="border-b text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Amount</th>
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
                          <td className="p-3">
                            <Badge
                              variant={tenantStatusVariant(payment.status)}
                            >
                              {payment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
