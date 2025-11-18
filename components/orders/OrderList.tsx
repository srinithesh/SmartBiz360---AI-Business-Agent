
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
      case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case OrderStatus.Confirmed: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case OrderStatus.ReadyForDelivery: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case OrderStatus.OutForDelivery: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case OrderStatus.Delivered: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case OrderStatus.Cancelled: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateOTP = (order: Order) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`OTP for order ${order.id} is ${otp}. (This would be sent via WhatsApp/SMS)`);
    onUpdateOrder({ ...order, otp, status: OrderStatus.ReadyForDelivery });
  };

  if (orders.length === 0) {
    return <p className="text-center text-gray-500 p-4">No orders found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">${order.amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {order.status === OrderStatus.Confirmed && (
                    <Button variant="secondary" size="sm" onClick={() => handleGenerateOTP(order)}>
                        Generate OTP
                    </Button>
                )}
                 {order.status === OrderStatus.Pending && (
                    <Button variant="secondary" size="sm" onClick={() => onUpdateOrder({...order, status: OrderStatus.Confirmed})}>
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
