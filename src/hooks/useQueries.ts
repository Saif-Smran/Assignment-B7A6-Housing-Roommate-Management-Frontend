"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboardStats,
  getAdminProperties,
  getAdminUsers,
} from "@/api/admin.api";
import {
  getApplicationsForProperties,
  getMyApplications,
  syncPaidOwnerApplications,
} from "@/api/applications.api";
import { getMyPayments, getOwnerEarnings } from "@/api/payments.api";
import { getProperties } from "@/api/properties.api";
import { getMaintenanceRequests, getViewingRequests } from "@/api/viewings.api";
import type {
  ApplicationFilterParams,
  PaymentFilterParams,
  PropertyFilterParams,
} from "@/interfaces";
import { useAuth } from "@/providers/auth.provider";

// ==================== TENANT HOOKS ====================

export function useTenantDashboardQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["tenant", "overview", token],
    queryFn: async () => {
      const [applicationsRes, viewingsRes, paymentsRes] = await Promise.all([
        getMyApplications(token || undefined),
        getViewingRequests(token || undefined),
        getMyPayments(
          { limit: 50, sortBy: "createdAt", sortOrder: "desc" },
          token || undefined,
        ),
      ]);
      return {
        applications: applicationsRes.data?.items ?? [],
        viewings: viewingsRes.data?.items ?? [],
        payments: paymentsRes.data?.items ?? [],
      };
    },
    enabled: Boolean(token),
  });
}

export function useTenantApplicationsQuery(params?: ApplicationFilterParams) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["tenant", "applications", token, params],
    queryFn: async () => {
      const res = await getMyApplications(token || undefined);
      return res.data?.items ?? [];
    },
    enabled: Boolean(token),
  });
}

export function useTenantPaymentsQuery(params?: PaymentFilterParams) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["tenant", "payments", token, params],
    queryFn: async () => {
      const res = await getMyPayments(params, token || undefined);
      return res.data?.items ?? [];
    },
    enabled: Boolean(token),
  });
}

export function useTenantViewingsQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["tenant", "viewings", token],
    queryFn: async () => {
      const res = await getViewingRequests(token || undefined);
      return res.data?.items ?? [];
    },
    enabled: Boolean(token),
  });
}

// ==================== OWNER HOOKS ====================

export function useOwnerDashboardQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["owner", "overview", token],
    queryFn: async () => {
      const [propertiesRes, viewingsRes, earningsRes] = await Promise.all([
        getProperties(undefined, token || undefined),
        getViewingRequests(token || undefined),
        getOwnerEarnings(token || undefined),
      ]);
      return {
        properties: propertiesRes.data?.items ?? [],
        viewings: viewingsRes.data?.items ?? [],
        earnings: earningsRes.data ?? null,
      };
    },
    enabled: Boolean(token),
  });
}

export function useOwnerFullDashboardQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["owner", "full-overview", token],
    queryFn: async () => {
      const properties = await getProperties({ limit: 50 }, token || undefined);
      const propertyIds = properties.data?.items.map((p) => p.id) ?? [];
      const applicationsPromise = getApplicationsForProperties(
        propertyIds,
        token || undefined,
      );
      const [applications, viewings, maintenance, payments] = await Promise.all(
        [
          applicationsPromise,
          getViewingRequests(token || undefined),
          getMaintenanceRequests(token || undefined),
          getMyPayments(
            { limit: 50, sortBy: "createdAt", sortOrder: "desc" },
            token || undefined,
          ),
        ],
      );

      await syncPaidOwnerApplications(
        applications.data?.items ?? [],
        payments.data?.items ?? [],
        token || undefined,
      );

      return {
        properties: properties.data?.items ?? [],
        applications: applications.data?.items ?? [],
        viewings: viewings.data?.items ?? [],
        maintenance: maintenance.data?.items ?? [],
        payments: payments.data?.items ?? [],
      };
    },
    enabled: Boolean(token),
  });
}

export function useOwnerPropertiesQuery(params?: PropertyFilterParams) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["owner", "properties", token, params],
    queryFn: async () => {
      const res = await getProperties(params, token || undefined);
      return res.data?.items ?? [];
    },
    enabled: Boolean(token),
  });
}

export function useOwnerEarningsQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["owner", "earnings", token],
    queryFn: async () => {
      const res = await getOwnerEarnings(token || undefined);
      return res.data ?? null;
    },
    enabled: Boolean(token),
  });
}

// ==================== ADMIN HOOKS ====================

export function useAdminStatsQuery() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["admin", "stats", token],
    queryFn: async () => {
      const res = await getAdminDashboardStats();
      return res.data ?? null;
    },
    enabled: Boolean(token),
  });
}

export function useAdminUsersQuery(params?: {
  page?: number;
  limit?: number;
  role?: import("@/interfaces").Role;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["admin", "users", token, params],
    queryFn: async () => {
      const res = await getAdminUsers(params);
      return res.data ?? null;
    },
    enabled: Boolean(token),
  });
}

export function useAdminPropertiesQuery(params?: {
  page?: number;
  limit?: number;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["admin", "properties", token, params],
    queryFn: async () => {
      const res = await getAdminProperties(params);
      return res.data ?? null;
    },
    enabled: Boolean(token),
  });
}
