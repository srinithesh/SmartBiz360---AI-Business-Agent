
import React from 'react';
import { Order, OrderStatus } from '../../types';
import Button from '../ui/Button';

interface OrderListProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateOrder }) => {

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending: return 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100';
      case OrderStatus.Confirmed: return 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100';
      case OrderStatus.ReadyForDelivery: return 'bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100';
      case OrderStatus.OutForDelivery: return 'bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100';
      case OrderStatus.Delivered: return 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100';
      case OrderStatus.Cancelled: return 'bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  const handleGenerateOTP = (order: Order) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`OTP for order ${order.id} is ${otp}. (This would be sent via WhatsApp/SMS)`);
    onUpdateOrder({ ...order, otp, status: OrderStatus.ReadyForDelivery });
  };

  if (orders.length === 0) {
    return <p className="text-center text-on-surface-variant p-6">No orders found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-outline/20">
        <thead className="bg-surface">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-outline/20">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{order.customerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">${order.amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {order.status === OrderStatus.Confirmed && (
                    <Button variant="outlined" size="sm" onClick={() => handleGenerateOTP(order)}>
                        Generate OTP
                    </Button>
                )}
                 {order.status === OrderStatus.Pending && (
                    <Button variant="outlined" size="sm" onClick={() => onUpdateOrder({...order, status: OrderStatus.Confirmed})}>
                        Confirm
                    </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;