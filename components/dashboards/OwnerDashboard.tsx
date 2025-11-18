
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../../types';
import Card from '../ui/Card';
import AddOrder from '../orders/AddOrder';
import OrderList from '../orders/OrderList';
import * as api from '../../api';
import { useWebSocket, WebSocketMessage } from '../../hooks/useWebSocket';
import Toast from '../ui/Toast';

const OwnerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    if (message.type === 'NEW_ORDER') {
      setOrders(prev => [message.payload, ...prev]);
      setToastMessage(`New Order #${message.payload.id} received from ${message.payload.employee}!`);
    } else if (message.type === 'ORDER_UPDATE') {
      setOrders(prev => prev.map(o => o.id === message.payload.id ? { ...o, status: message.payload.status } : o));
      setToastMessage(`Order #${message.payload.id} status updated to "${message.payload.status}".`);
    }
  }, []);

  useWebSocket(handleWebSocketMessage);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await api.getOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAddOrder = async (order: Omit<Order, 'id' | 'status' | 'date' | 'otp'>) => {
    const newOrder = await api.addOrder(order);
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    const savedOrder = await api.updateOrder(updatedOrder);
    setOrders(orders.map(o => o.id === savedOrder.id ? savedOrder : o));
  };

  const employees = useMemo(() => ['all', ...Array.from(new Set(orders.map(o => o.employee)))], [orders]);
  
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const statusMatch = filterStatus === 'all' || order.status === filterStatus;
      const employeeMatch = filterEmployee === 'all' || order.employee === filterEmployee;
      return statusMatch && employeeMatch;
    });
  }, [orders, filterStatus, filterEmployee]);

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} type="info" onClose={() => setToastMessage(null)} />}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Live Sync Active</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">All Orders</h2>
                <div className="flex items-center gap-4">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as OrderStatus | 'all')} className="rounded-md dark:bg-gray-700 dark:border-gray-600">
                        <option value="all">All Statuses</option>
                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} className="rounded-md dark:bg-gray-700 dark:border-gray-600">
                        {employees.map(e => <option key={e} value={e}>{e === 'all' ? 'All Employees' : e}</option>)}
                    </select>
                </div>
            </div>
            {isLoading ? (
              <p className="p-4 text-center">Loading orders...</p>
            ) : error ? (
              <p className="p-4 text-center text-red-500">{error}</p>
            ) : (
              <OrderList orders={filteredOrders} onUpdateOrder={handleUpdateOrder}/>
            )}
          </Card>
        </div>
        <div className="lg:col-span-1">
          <AddOrder onAddOrder={handleAddOrder} />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;