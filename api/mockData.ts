
import { Order, Customer, Property, Tenant, ComplianceItem, Vehicle, OrderStatus } from '../types';

export const initialOrders: Order[] = [
    { id: 'ORD001', customerName: 'John Doe', amount: 150.00, status: OrderStatus.Delivered, date: '2024-07-20', employee: 'Bob', paymentType: 'Full' },
    { id: 'ORD002', customerName: 'Jane Smith', amount: 200.50, status: OrderStatus.Pending, date: '2024-07-21', employee: 'Bob', paymentType: 'Credit', creditAmount: 200.50, dueDate: '2024-08-20' },
    { id: 'ORD003', customerName: 'Peter Jones', amount: 75.25, status: OrderStatus.OutForDelivery, date: '2024-07-21', employee: 'Charlie', paymentType: 'Advance', otp: '123456' },
    { id: 'ORD004', customerName: 'Mary Poppins', amount: 500.00, status: OrderStatus.ReadyForDelivery, date: '2024-07-22', employee: 'Self', paymentType: 'Full', otp: '654321' },
];

export const initialCustomers: Customer[] = [
  { id: 'CUST01', name: 'Jane Smith', phone: '555-0102', riskScore: 85, predictedRepaymentDate: '2024-08-20', creditHistory: [
    { amount: 200.50, paidOnTime: true, date: '2024-06-15' },
    { amount: 150.00, paidOnTime: true, date: '2024-05-10' },
  ]},
  { id: 'CUST02', name: 'New Customer', phone: '555-0103', riskScore: 50, predictedRepaymentDate: 'N/A', creditHistory: []},
  { id: 'CUST03', name: 'Late Payer', phone: '555-0104', riskScore: 25, predictedRepaymentDate: '2024-08-25', creditHistory: [
    { amount: 100.00, paidOnTime: false, date: '2024-06-20' },
    { amount: 50.00, paidOnTime: true, date: '2024-05-15' },
  ]},
];

export const initialProperties: Property[] = [
  { id: 'P01', name: 'Downtown Plaza', type: 'Building', address: '123 Main St' },
  { id: 'P02', name: 'Shop #5', type: 'Shop', address: '123 Main St' },
];

export const initialTenants: Tenant[] = [
  { id: 'T01', name: 'Tech Solutions Inc.', propertyId: 'P02', rentAmount: 1200, deposit: 2400, dueDate: 1, contractExpiry: '2025-12-31', pendingDues: 0 },
  { id: 'T02', name: 'Coffee Corner', propertyId: 'P01', rentAmount: 800, deposit: 1600, dueDate: 5, contractExpiry: '2024-08-31', pendingDues: 800 },
];

export const initialComplianceItems: ComplianceItem[] = [
  { id: 'C01', name: 'GST Filing (Monthly)', dueDate: '2024-08-20', category: 'Tax' },
  { id: 'C02', name: 'Business Loan EMI', dueDate: '2024-08-05', category: 'Loan' },
  { id: 'C03', name: 'Trade License Renewal', dueDate: '2025-03-31', category: 'License' },
  { id: 'C04', name: 'Income Tax Advance Payment', dueDate: '2024-09-15', category: 'Tax' },
];

export const initialVehicles: Vehicle[] = [
  { id: 'V01', name: 'Delivery Van', number: 'MH-12-AB-1234', pucExpiry: '2024-09-15', insuranceExpiry: '2025-01-20', fcExpiry: '2028-06-30', roadTaxExpiry: '2030-01-01' },
  { id: 'V02', name: 'Owner Car', number: 'MH-14-CD-5678', pucExpiry: '2024-07-30', insuranceExpiry: '2024-11-05', fcExpiry: '2029-04-10', roadTaxExpiry: '2031-01-01' },
];
