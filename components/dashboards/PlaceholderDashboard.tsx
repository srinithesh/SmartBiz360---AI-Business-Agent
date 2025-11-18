
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../ui/Card';
import OrderList from '../orders/OrderList';
import { Order, OrderStatus, UserRole } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import * as api from '../../api';

const PlaceholderDashboard: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [otp, setOtp] = useState('');
    const [otpOrder, setOtpOrder] = useState<Order | null>(null);
    const [otpMessage, setOtpMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        const fetchRoleData = async () => {
            if (!user) return;
            setIsLoading(true);
            let userOrders: Order[] = [];
            switch (user.role) {
                case UserRole.Employee:
                    userOrders = await api.getOrdersByEmployee('Bob'); // Hardcoded for demo
                    break;
                case UserRole.Delivery:
                    userOrders = await api.getOrdersByStatus(OrderStatus.OutForDelivery);
                    if (userOrders.length > 0) {
                        setOtpOrder(userOrders[0]); // Select first order for OTP demo
                    }
                    break;
                case UserRole.Accountant:
                    userOrders = await api.getOrdersByPaymentType('Credit');
                    break;
            }
            setOrders(userOrders);
            setIsLoading(false);
        };

        fetchRoleData();
    }, [user]);
    
    const handleVerifyOtp = async () => {
        if (!otpOrder || !otp) return;
        const success = await api.verifyOtp(otpOrder.id, otp);
        if (success) {
            setOtpMessage({type: 'success', text: 'Delivery confirmed successfully!'});
            // In a real app, we'd refetch or update state
        } else {
            setOtpMessage({type: 'error', text: 'Invalid OTP. Please try again.'});
        }
    }

    const renderContent = () => {
        if (isLoading) return <p>Loading dashboard...</p>;

        switch (user?.role) {
            case UserRole.Employee:
                return (
                    <Card header={<h2 className="text-xl font-semibold">Your Assigned Orders</h2>}>
                        <OrderList orders={orders} onUpdateOrder={() => {}} />
                    </Card>
                );
            case UserRole.Delivery:
                return (
                    <Card header={<h2 className="text-xl font-semibold">Verify Delivery</h2>}>
                       {otpOrder ? (
                         <div className="space-y-4">
                            <p>Enter the OTP from the customer to mark the order as delivered.</p>
                            <Input label="Order ID" value={otpOrder.id} disabled />
                            <Input label="Customer" value={otpOrder.customerName} disabled />
                            <Input label="OTP Code" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            <Button className="w-full" onClick={handleVerifyOtp}>Verify & Complete Delivery</Button>
                            {otpMessage && <p className={`text-sm font-bold ${otpMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{otpMessage.text}</p>}
                        </div>
                       ) : (
                        <p>No orders currently out for delivery.</p>
                       )}
                    </Card>
                );
            case UserRole.Accountant:
                return (
                    <Card header={<h2 className="text-xl font-semibold">Credit & Payments</h2>}>
                        <p>Showing orders with pending payments or on credit.</p>
                        <OrderList orders={orders} onUpdateOrder={() => {}} />
                    </Card>
                );
            default:
                return <p>Dashboard view is not available for this role.</p>;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.role} Dashboard</h1>
            {renderContent()}
        </div>
    );
};

export default PlaceholderDashboard;
