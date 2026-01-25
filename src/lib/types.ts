export type Expense = {
  id: string;
  name: string;
  amount: number;
  category: 'Maintenance' | 'Utility' | 'Tax' | 'Salary' | 'Other';
  date: string;
};

export type Tenant = {
  id: string;
  name: string;
  rent: number;
  leaseEndDate: string;
};

export type Property = {
  id: string;
  name: string;
  location: string;
  imageId: string;
  totalIncome: number;
  expenses: number;
  rooms: {
    count: number;
    sizes: string[];
  };
  tenants: Tenant[];
  expenseDetails: Expense[];
  currentRent: number;
};
