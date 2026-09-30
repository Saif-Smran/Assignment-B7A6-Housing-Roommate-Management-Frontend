import type { JsonObject, Payment } from "@/interfaces";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export type { Payment, JsonObject };
