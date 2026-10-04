"use client";

import { Hammer, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyApplications } from "@/api/applications.api";
import { getRoomById } from "@/api/properties.api";
import {
  createMaintenanceRequest,
  getMaintenanceRequests,
} from "@/api/viewings.api";
import {
  TenantEmpty,
  TenantPageHeader,
  tenantSectionClass,
  tenantStatusVariant,
} from "@/components/tenant/tenant-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Application, MaintenanceRequest, Room } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

type ApprovedRoom = { application: Application; room: Room };
export default function TenantMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [rooms, setRooms] = useState<ApprovedRoom[]>([]);
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token = getAuthToken() || undefined;
  useEffect(() => {
    async function load() {
      const [applicationsResponse, requestsResponse] = await Promise.all([
        getMyApplications(token),
        getMaintenanceRequests(token),
      ]);
      if (requestsResponse.success)
        setRequests(requestsResponse.data?.items ?? []);
      else
        toast.error(
          requestsResponse.message || "Unable to load maintenance requests.",
        );
      if (!applicationsResponse.success) {
        toast.error(
          applicationsResponse.message || "Unable to load approved rooms.",
        );
        setLoading(false);
        return;
      }
      const approved = (applicationsResponse.data?.items ?? []).filter(
        (application) => application.status === "APPROVED",
      );
      const roomResults = await Promise.all(
        approved.map(async (application) => ({
          application,
          response: await getRoomById(application.roomId, token),
        })),
      );
      const approvedRooms = roomResults.flatMap(({ application, response }) =>
        response.success && response.data
          ? [{ application, room: response.data }]
          : [],
      );
      setRooms(approvedRooms);
      setRoomId(approvedRooms[0]?.room.id ?? "");
      setLoading(false);
    }
    void load();
  }, [token]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roomId) {
      toast.error("Select an approved room first.");
      return;
    }
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    const response = await createMaintenanceRequest(
      roomId,
      {
        title: String(form.get("title")),
        description: String(form.get("description")),
        priority: String(form.get("priority")) as "LOW" | "MEDIUM" | "HIGH",
      },
      token,
    );
    if (!response.success)
      toast.error(response.message || "Unable to submit maintenance request.");
    else {
      setRequests((current) => [response.data, ...current]);
      event.currentTarget.reset();
      toast.success("Maintenance request submitted.");
    }
    setSubmitting(false);
  }
  return (
    <section className={tenantSectionClass}>
      <TenantPageHeader
        title="Maintenance"
        description="Submit and track maintenance requests for your approved room."
      />
      {loading ? (
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Submit a request</CardTitle>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Maintenance requests are available after an application is
                  approved.
                </p>
              ) : (
                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                  <label
                    htmlFor="maintenance-room"
                    className="space-y-1 text-sm"
                  >
                    <span>Approved room</span>
                    <select
                      id="maintenance-room"
                      value={roomId}
                      onChange={(event) => setRoomId(event.target.value)}
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      {rooms.map(({ room }) => (
                        <option key={room.id} value={room.id}>
                          Room {room.roomNumber || room.id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label
                    htmlFor="maintenance-priority"
                    className="space-y-1 text-sm"
                  >
                    <span>Priority</span>
                    <select
                      id="maintenance-priority"
                      name="priority"
                      defaultValue="MEDIUM"
                      className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option>LOW</option>
                      <option>MEDIUM</option>
                      <option>HIGH</option>
                    </select>
                  </label>
                  <label
                    htmlFor="maintenance-title"
                    className="space-y-1 text-sm sm:col-span-2"
                  >
                    <span>Title</span>
                    <Input
                      id="maintenance-title"
                      name="title"
                      required
                      placeholder="Broken air conditioner"
                    />
                  </label>
                  <label
                    htmlFor="maintenance-description"
                    className="space-y-1 text-sm sm:col-span-2"
                  >
                    <span>Description</span>
                    <textarea
                      id="maintenance-description"
                      name="description"
                      required
                      className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder="Describe the issue and where it occurs."
                    />
                  </label>
                  <div>
                    <Button disabled={submitting}>
                      <Send /> {submitting ? "Submitting..." : "Submit request"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold">My requests</h2>
            {requests.length === 0 ? (
              <TenantEmpty message="You have no maintenance requests." />
            ) : (
              requests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="flex flex-wrap items-start justify-between gap-3 pt-6">
                    <div className="flex gap-3">
                      <Hammer className="mt-1 h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Room {request.roomId} · {request.priority}
                        </p>
                        <p className="mt-1 text-sm">{request.description}</p>
                      </div>
                    </div>
                    <Badge variant={tenantStatusVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
