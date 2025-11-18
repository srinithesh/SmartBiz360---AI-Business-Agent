
import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface AddOrderProps {
  onAddOrder: (order: Omit<Order, 'id' | 'status' | 'date' | 'otp'>) => void;
}

const AddOrder: React.FC<AddOrderProps> = ({ onAddOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [employee, setEmployee] = useState('');
  const [paymentType, setPaymentType] = useState<'Full' | 'Advance' | 'Credit'>('Full');
  
  const { transcript, isListening, startListening, hasSupport, error } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
        // Simple parsing logic, can be improved with Gemini for structured data extraction.
        // Example voice command: "New order for Sarah Connor amount 250 assigned to Bob on credit"
        const lowerTranscript = transcript.toLowerCase();
        const nameMatch = lowerTranscript.match(/for ([\w\s]+?)(?: amount| assigned|$)/);
        const amountMatch = lowerTranscript.match(/amount (\d+(\.\d+)?)/);
        const employeeMatch = lowerTranscript.match(/assigned to ([\w\s]+?)(?: on|$)/);
        
        if (nameMatch) setCustomerName(nameMatch[1].trim());
        if (amountMatch) setAmount(amountMatch[1]);
        if (employeeMatch) setEmployee(employeeMatch[1].trim());
        if (lowerTranscript.includes('credit')) setPaymentType('Credit');
        else if (lowerTranscript.includes('advance')) setPaymentType('Advance');
        else setPaymentType('Full');
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount || !employee) return;
    
    const newOrder: Omit<Order, 'id' | 'status' | 'date' | 'otp'> = {
      customerName,
      amount: parseFloat(amount),
      employee,
      paymentType,
    };
    
    if (paymentType === 'Credit') {
      newOrder.creditAmount = parseFloat(amount);
    }
    
    onAddOrder(newOrder);
    setCustomerName('');
    setAmount('');
    setEmployee('');
    setPaymentType('Full');
  };

  return (
    <Card header={<h2 className="text-xl font-semibold">Add New Order</h2>}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g., John Doe" required />
        <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 150.00" required />
        <Input label="Assigned To" value={employee} onChange={e => setEmployee(e.target.value)} placeholder="e.g., Bob or Self" required />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Type</label>
          <select value={paymentType} onChange={e => setPaymentType(e.target.value as any)} className="w-full rounded-md dark:bg-gray-700 dark:border-gray-600">
            <option value="Full">Full Payment</option>
            <option value="Advance">Advance</option>
            <option value="Credit">On Credit</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">Add Order</Button>
            {hasSupport && (
                <Button type="button" variant="secondary" onClick={startListening} disabled={isListening} className="w-full">
                {isListening ? 'Listening...' : 'Add with Voice'}
                </Button>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </Card>
  );
};

export default AddOrder;

