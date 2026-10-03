"use client";

import { CreditCard, FileText, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getApplicationsForProperties } from "@/api/applications.api";
import { initiatePayment } from "@/api/payments.api";
import { getProperties, getRoomById } from "@/api/properties.api";
import {
  OwnerEmpty,
  OwnerPageHeader,
  OwnerStatus,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Application, PaymentType, Room } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

type BillingCandidate = { application: Application; room: Room };

export default function OwnerBillingPage() {
  const [candidates, setCandidates] = useState<BillingCandidate[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [billType, setBillType] = useState<"RENT" | "UTILITY">("RENT");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState(
    "Monthly rent payment via Stripe gateway",
  );
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const token = getAuthToken() || undefined;

  useEffect(() => {
    async function loadApprovedRooms() {
      const propertiesResponse = await getProperties({ limit: 100 }, token);
      if (!propertiesResponse.success) {
        toast.error(propertiesResponse.message || "Unable to load properties.");
        setLoading(false);
        return;
      }

      const applicationsResponse = await getApplicationsForProperties(
        propertiesResponse.data?.items.map((property) => property.id) ?? [],
        token,
      );
      if (!applicationsResponse.success) {
        toast.error(
          applicationsResponse.message || "Unable to load applications.",
        );
        setLoading(false);
        return;
      }

      const approvedApplications = (
        applicationsResponse.data?.items ?? []
      ).filter((application) => application.status === "APPROVED");
      const roomResults = await Promise.all(
        approvedApplications.map(async (application) => ({
          application,
          response: await getRoomById(application.roomId, token),
        })),
      );
      const loadedCandidates = roomResults.flatMap(
        ({ application, response }) =>
          response.success && response.data
            ? [{ application, room: response.data }]
            : [],
      );
      setCandidates(loadedCandidates);
      setSelectedId(loadedCandidates[0]?.application.id ?? "");
      if (roomResults.some(({ response }) => !response.success)) {
        toast.error("Some approved rooms could not be loaded.");
      }
      setLoading(false);
    }

    void loadApprovedRooms();
  }, [token]);

  const selected = useMemo(
    () => candidates.find(({ application }) => application.id === selectedId),
    [candidates, selectedId],
  );

  useEffect(() => {
    if (!selected) return;
    setAmount(billType === "RENT" ? String(selected.room.rentAmount) : "");
  }, [billType, selected]);

  function changeBillType(nextType: "RENT" | "UTILITY") {
    setBillType(nextType);
    setDescription(
      nextType === "RENT"
        ? "Monthly rent payment via Stripe gateway"
        : "Monthly utility bill via Stripe gateway",
    );
    if (nextType === "RENT" && selected) {
      setAmount(String(selected.room.rentAmount));
    } else if (nextType === "UTILITY") {
      setAmount("");
    }
  }

  async function generateBill() {
    if (!selected) return;
    const billAmount = Number(amount);
    if (!Number.isFinite(billAmount) || billAmount <= 0) {
      toast.error("Enter a bill amount greater than zero.");
      return;
    }
    setGenerating(true);
    const origin = window.location.origin;
    const response = await initiatePayment(
      {
        applicationId: selected.application.id,
        amount: billAmount,
        paymentType: billType as PaymentType,
        description: description.trim(),
        successUrl: `${origin}/payment/success`,
        cancelUrl: `${origin}/payment/cancel`,
      },
      token,
    );
    if (!response.success || !response.data?.checkoutUrl) {
      toast.error(response.message || "Unable to generate the bill.");
      setGenerating(false);
      return;
    }
    window.location.assign(response.data.checkoutUrl);
  }

  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="Tenant bills"
        description="Select an approved tenant room and generate a rent or utility checkout bill."
      />
      {loading ? (
        <div className="h-56 animate-pulse rounded-lg bg-muted" />
      ) : candidates.length === 0 ? (
        <OwnerEmpty message="No rooms with approved applications are ready for billing." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Approved rooms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {candidates.map(({ application, room }) => (
                <button
                  type="button"
                  key={application.id}
                  onClick={() => setSelectedId(application.id)}
                  className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${selectedId === application.id ? "border-indigo-500 bg-indigo-500/10" : "hover:bg-muted"}`}
                >
                  <span className="block font-medium">
                    Room {room.roomNumber || room.id}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Tenant: {application.tenantId}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    BDT {room.rentAmount.toLocaleString()} / month
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
          {selected && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <FileText className="mb-3 h-8 w-8 text-indigo-600" />
                    <CardTitle>Generate tenant bill</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Application: {selected.application.id}
                    </p>
                  </div>
                  <OwnerStatus value={selected.application.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Tenant</p>
                    <p className="font-medium">
                      {selected.application.tenantId}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium">
                      {selected.room.roomNumber || selected.room.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment type</p>
                    <select
                      value={billType}
                      onChange={(event) =>
                        changeBillType(event.target.value as "RENT" | "UTILITY")
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option value="RENT">RENT</option>
                      <option value="UTILITY">UTILITY</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="bill-amount"
                      className="text-muted-foreground"
                    >
                      Bill amount
                    </label>
                    <Input
                      id="bill-amount"
                      type="number"
                      min="1"
                      value={amount}
                      readOnly={billType === "RENT"}
                      onChange={(event) => setAmount(event.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-4 text-base">
                  <span className="font-medium">Bill total</span>
                  <span className="text-xl font-bold">
                    BDT {(Number(amount) || 0).toLocaleString()}
                  </span>
                </div>
                <label htmlFor="bill-description" className="block space-y-2">
                  <span className="font-medium">Bill description</span>
                  <textarea
                    id="bill-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={`Describe this month's ${billType.toLowerCase()} bill`}
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <Button
                  disabled={generating || !description.trim()}
                  onClick={() => void generateBill()}
                >
                  <CreditCard />{" "}
                  {generating ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Generating...
                    </>
                  ) : (
                    `Generate ${billType.toLowerCase()} bill`
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  );
}
