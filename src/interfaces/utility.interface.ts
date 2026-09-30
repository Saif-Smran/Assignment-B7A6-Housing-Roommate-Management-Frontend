import type { BillStatus } from "./enums.interface";

export interface UtilityBill {
  id: string;
  propertyId: string;
  month: string;
  totalAmount: number;
  status: BillStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UtilitySplit {
  id: string;
  billId: string;
  tenantId: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
}
