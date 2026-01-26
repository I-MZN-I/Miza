import type { Property } from './types';

export const properties: Property[] = [
  {
    id: 'p1',
    name: 'Emerald Towers',
    location: '123 Green Avenue, Metropolis',
    imageId: 'property-1',
    totalIncome: 7500,
    expenses: 2200,
    currentRent: 2500,
    aiScore: 92,
    rooms: {
      count: 3,
      sizes: ['12x14 sqft', '10x12 sqft', '10x10 sqft'],
    },
    tenants: [
      { id: 't1', name: 'Alice Johnson', rent: 2500, leaseEndDate: '2024-12-31' },
      { id: 't2', name: 'Bob Williams', rent: 2500, leaseEndDate: '2025-05-31' },
      { id: 't3', name: 'Charlie Brown', rent: 2500, leaseEndDate: '2024-08-31' },
    ],
    expenseDetails: [
      { id: 'e1', name: 'Plumbing Repair', amount: 350, category: 'Maintenance', date: '2024-05-10' },
      { id: 'e2', name: 'Electricity Bill', amount: 500, category: 'Utility', date: '2024-05-15' },
      { id: 'e3', name: 'Property Tax', amount: 1200, category: 'Tax', date: '2024-05-20' },
      { id: 'e4', name: 'Janitor Salary', amount: 150, category: 'Salary', date: '2024-05-01' },
    ],
  },
  {
    id: 'p2',
    name: 'Golden Lofts',
    location: '456 Gold Street, Star City',
    imageId: 'property-2',
    totalIncome: 12000,
    expenses: 4500,
    currentRent: 3000,
    aiScore: 85,
    rooms: {
      count: 4,
      sizes: ['15x15 sqft', '12x12 sqft', '10x12 sqft', '10x10 sqft'],
    },
    tenants: [
      { id: 't4', name: 'Diana Prince', rent: 3000, leaseEndDate: '2025-02-28' },
      { id: 't5', name: 'Clark Kent', rent: 3000, leaseEndDate: '2024-11-30' },
      { id: 't6', name: 'Bruce Wayne', rent: 3000, leaseEndDate: '2025-09-30' },
      { id: 't7', name: 'Barry Allen', rent: 3000, leaseEndDate: '2024-07-31' },
    ],
    expenseDetails: [
      { id: 'e5', name: 'Roof Sealing', amount: 1500, category: 'Maintenance', date: '2024-05-05' },
      { id: 'e6', name: 'Water Bill', amount: 800, category: 'Utility', date: '2024-05-18' },
      { id: 'e7', name: 'Insurance', amount: 2200, category: 'Other', date: '2024-05-25' },
    ],
  },
  {
    id: 'p3',
    name: 'Azure Apartments',
    location: '789 Blue Lane, Gotham',
    imageId: 'property-3',
    totalIncome: 5000,
    expenses: 1800,
    currentRent: 2500,
    aiScore: 78,
    rooms: {
      count: 2,
      sizes: ['14x16 sqft', '12x12 sqft'],
    },
    tenants: [
      { id: 't8', name: 'Selina Kyle', rent: 2500, leaseEndDate: '2025-01-31' },
      { id: 't9', name: 'Harvey Dent', rent: 2500, leaseEndDate: '2024-10-31' },
    ],
    expenseDetails: [
      { id: 'e8', name: 'HVAC Service', amount: 400, category: 'Maintenance', date: '2024-05-12' },
      { id: 'e9', name: 'Gas Bill', amount: 300, category: 'Utility', date: '2024-05-22' },
      { id: 'e10', name: 'Property Management Fee', amount: 1100, category: 'Other', date: '2024-05-01' },
    ],
  },
];

export const financialChartData = [
  { month: "Jan", income: 24500, expenses: 8500 },
  { month: "Feb", income: 24500, expenses: 9200 },
  { month: "Mar", income: 24500, expenses: 8800 },
  { month: "Apr", income: 24500, expenses: 9500 },
  { month: "May", income: 24500, expenses: 8500 },
];
