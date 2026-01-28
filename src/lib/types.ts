'use client';

import { Timestamp } from "firebase/firestore";

export type WithId<T> = T & { id: string };

export type Property = {
  userId: string;
  buildingName: string;
  location: string;
  imageURL: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'active' | 'deleted';
  deletedAt?: Timestamp;
  totalRent?: number;
  // These are populated from sub-collections
  tenants?: WithId<Tenant>[];
  expenseDetails?: WithId<Expense>[];
};

export type Tenant = {
  propertyId: string;
  name: string;
  email?: string;
  phone: string;
  rent: number;
  moveInDate: string;
  moveOutDate?: string;
  payments?: { [key: string]: { date: string; } };
};

export type Expense = {
  propertyId: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  receiptURL?: string;
};

export type Agreement = {
  tenantId: string;
  documentURL: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  terms: string;
};
