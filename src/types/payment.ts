import type { PaymentGateway, PaymentStatus, PaymentType } from "./enums";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
	[key: string]: JsonValue;
}

export interface Payment {
	id: string;
	applicationId: string | null;
	userId: string;
	amount: number;
	currency: string;
	paymentMethod: PaymentGateway;
	transactionId: string | null;
	status: PaymentStatus;
	paymentType: PaymentType;
	description: string | null;
	metadata: JsonValue | null;
	createdAt: string;
	updatedAt: string;
}
