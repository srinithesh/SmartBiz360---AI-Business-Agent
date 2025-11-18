
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  Owner = 'Owner',
  Employee = 'Employee',
  Delivery = 'Delivery',
  Accountant = 'Accountant',
}

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  ReadyForDelivery = 'Ready for Delivery',
  OutForDelivery = 'Out for Delivery',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  date: string;
  employee: string;
  paymentType: 'Full' | 'Advance' | 'Credit';
  creditAmount?: number;
  dueDate?: string;
  otp?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  creditHistory: { amount: number; paidOnTime: boolean; date: string }[];
  riskScore: number;
  predictedRepaymentDate: string;
  isLoading?: boolean; // Added for per-customer loading state
}

export interface Property {
  id: string;
  name: string;
  type: 'Building' | 'Room' | 'Shop';
  address: string;
}

export interface Tenant {
  id: string;
  name: string;
  propertyId: string;
  rentAmount: number;
  deposit: number;
  dueDate: number; // Day of the month
  contractExpiry: string;
  pendingDues: number;
}

export interface ComplianceItem {
  id: string;
  name: string;
  dueDate: string;
  category: 'Tax' | 'License' | 'Loan';
}

export interface Vehicle {
  id: string;
  name: string;
  number: string;
  pucExpiry: string;
  insuranceExpiry: string;
  fcExpiry: string;
  roadTaxExpiry: string;
}

export interface SecurityScanResult {
  score: number;
  vulnerabilities: {
    title: string;
    description: string;
    risk: 'High' | 'Medium' | 'Low';
    recommendation: string;
  }[];
}

export interface BehavioralQuestion {
  question: string;
  options: string[];
  correctAnswerIndex?: number; // Only for setup
}