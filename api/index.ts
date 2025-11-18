
import { Order, Customer, Property, Tenant, ComplianceItem, Vehicle, OrderStatus } from '../types';
import { initialOrders, initialCustomers, initialProperties, initialTenants, initialComplianceItems, initialVehicles } from './mockData';

const LATENCY = 500; // 500ms delay to simulate network

// --- Generic LocalStorage Handler ---
function getFromStorage<T>(key: string, initialData: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return initialData;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    const item = JSON.stringify(data);
    window.localStorage.setItem(key, item);
  } catch (error) {
    console.error(`Error saving to localStorage key “${key}”:`, error);
  }
}

// --- Initialize Data ---
const DB_KEYS = {
  ORDERS: 'sb360_orders',
  CUSTOMERS: 'sb360_customers',
  PROPERTIES: 'sb360_properties',
  TENANTS: 'sb360_tenants',
  COMPLIANCE: 'sb360_compliance',
  VEHICLES: 'sb360_vehicles',
};

// Seed initial data if localStorage is empty
if (!localStorage.getItem(DB_KEYS.ORDERS)) {
  saveToStorage(DB_KEYS.ORDERS, initialOrders);
}
if (!localStorage.getItem(DB_KEYS.CUSTOMERS)) {
  saveToStorage(DB_KEYS.CUSTOMERS, initialCustomers);
}
if (!localStorage.getItem(DB_KEYS.PROPERTIES)) {
  saveToStorage(DB_KEYS.PROPERTIES, initialProperties);
}
if (!localStorage.getItem(DB_KEYS.TENANTS)) {
  saveToStorage(DB_KEYS.TENANTS, initialTenants);
}
if (!localStorage.getItem(DB_KEYS.COMPLIANCE)) {
    saveToStorage(DB_KEYS.COMPLIANCE, initialComplianceItems);
}
if (!localStorage.getItem(DB_KEYS.VEHICLES)) {
    saveToStorage(DB_KEYS.VEHICLES, initialVehicles);
}


// --- API Functions ---

// Orders
export const getOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = getFromStorage<Order[]>(DB_KEYS.ORDERS, []);
      resolve(orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, LATENCY);
  });
};

export const addOrder = (orderData: Omit<Order, 'id' | 'status' | 'date' | 'otp'>): Promise<Order> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const orders = getFromStorage<Order[]>(DB_KEYS.ORDERS, []);
            const newOrder: Order = {
                ...orderData,
                id: `ORD${(orders.length + 1).toString().padStart(3, '0')}`,
                status: OrderStatus.Pending,
                date: new Date().toISOString().split('T')[0],
            };
            const updatedOrders = [newOrder, ...orders];
            saveToStorage(DB_KEYS.ORDERS, updatedOrders);
            resolve(newOrder);
        }, LATENCY);
    });
};

export const updateOrder = (updatedOrder: Order): Promise<Order> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const orders = getFromStorage<Order[]>(DB_KEYS.ORDERS, []);
            const newOrders = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
            saveToStorage(DB_KEYS.ORDERS, newOrders);
            resolve(updatedOrder);
        }, LATENCY);
    });
};

export const getOrdersByEmployee = async (employeeName: string): Promise<Order[]> => {
    const allOrders = await getOrders();
    return allOrders.filter(o => o.employee === employeeName);
}

export const getOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
    const allOrders = await getOrders();
    return allOrders.filter(o => o.status === status);
}

export const getOrdersByPaymentType = async (paymentType: 'Credit'): Promise<Order[]> => {
    const allOrders = await getOrders();
    return allOrders.filter(o => o.paymentType === paymentType);
}

export const verifyOtp = (orderId: string, otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const orders = getFromStorage<Order[]>(DB_KEYS.ORDERS, []);
            const order = orders.find(o => o.id === orderId);
            if (order && order.otp === otp) {
                const updatedOrder = { ...order, status: OrderStatus.Delivered };
                updateOrder(updatedOrder);
                resolve(true);
            } else {
                resolve(false);
            }
        }, LATENCY);
    });
}


// Customers
export const getCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFromStorage<Customer[]>(DB_KEYS.CUSTOMERS, []));
    }, LATENCY);
  });
};

export const updateCustomer = (updatedCustomer: Customer): Promise<Customer> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customers = getFromStorage<Customer[]>(DB_KEYS.CUSTOMERS, []);
            const newCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
            saveToStorage(DB_KEYS.CUSTOMERS, newCustomers);
            resolve(updatedCustomer);
        }, LATENCY);
    });
};

// Properties & Tenants
export const getProperties = (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFromStorage<Property[]>(DB_KEYS.PROPERTIES, []));
    }, LATENCY);
  });
};

export const getTenants = (): Promise<Tenant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFromStorage<Tenant[]>(DB_KEYS.TENANTS, []));
    }, LATENCY);
  });
};

// Compliance
export const getComplianceItems = (): Promise<ComplianceItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFromStorage<ComplianceItem[]>(DB_KEYS.COMPLIANCE, []));
    }, LATENCY);
  });
};

// Vehicles
export const getVehicles = (): Promise<Vehicle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getFromStorage<Vehicle[]>(DB_KEYS.VEHICLES, []));
    }, LATENCY);
  });
};
