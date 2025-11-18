import { useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../types';
import * as api from '../api';

export type WebSocketMessage = 
    | { type: 'NEW_ORDER'; payload: Order }
    | { type: 'ORDER_UPDATE'; payload: { id: string; status: OrderStatus } };

// This is a simulation of a WebSocket connection.
// In a real application, you would use a library like `socket.io-client`.
export const useWebSocket = (onMessage: (message: WebSocketMessage) => void) => {
  // FIX: Replace NodeJS.Timeout with 'number' for browser compatibility.
  // The 'setInterval' function in a browser environment returns a number, not a NodeJS.Timeout object.
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const simulateServerPush = async () => {
        // 50% chance of an event happening every 5 seconds
        if (Math.random() < 0.5) {
            const orders = await api.getOrders();
            if (orders.length === 0) return;

            // 30% chance of a new order, 70% chance of an update
            if (Math.random() < 0.3) {
                // Simulate a new order from a different employee
                const newOrder = {
                    customerName: 'Live Customer',
                    amount: Math.round(Math.random() * 200) + 50,
                    employee: 'Charlie',
                    paymentType: 'Full' as const,
                };
                const createdOrder = await api.addOrder(newOrder);
                onMessage({ type: 'NEW_ORDER', payload: createdOrder });
            } else {
                // Simulate a status update on an existing order
                const orderToUpdate = orders.find(o => o.status === OrderStatus.Pending || o.status === OrderStatus.Confirmed);
                if (orderToUpdate) {
                    const newStatus = orderToUpdate.status === OrderStatus.Pending ? OrderStatus.Confirmed : OrderStatus.ReadyForDelivery;
                    onMessage({ type: 'ORDER_UPDATE', payload: { id: orderToUpdate.id, status: newStatus }});
                }
            }
        }
    };
    
    // Start the simulation
    intervalRef.current = window.setInterval(simulateServerPush, 5000); // Simulate an event every 5 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onMessage]);
};
