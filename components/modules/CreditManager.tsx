
import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { analyzeCustomerCredit } from '../../services/geminiService';
import * as api from '../../api';

const CreditManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const fetchedCustomers = await api.getCustomers();
        setCustomers(fetchedCustomers);
        setError(null);
      } catch (err) {
        setError("Failed to fetch customer data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleAnalyze = async (customer: Customer) => {
    // Set loading state for the specific customer
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, isLoading: true } : c));
    setSelectedCustomer(c => c ? { ...c, isLoading: true } : null);

    const result = await analyzeCustomerCredit(customer);
    const updatedCustomer = { ...customer, ...result, isLoading: false };
    
    const savedCustomer = await api.updateCustomer(updatedCustomer);

    setCustomers(customers.map(c => c.id === customer.id ? savedCustomer : c));
    setSelectedCustomer(savedCustomer);
  };

  if (isLoading) return <p>Loading customers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Credit Memory</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card header={<h2 className="text-xl font-semibold">Customers on Credit</h2>}>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map(customer => (
                <li key={customer.id} className="py-3">
                  <button onClick={() => handleSelectCustomer(customer)} className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-md">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Risk Score: {customer.riskScore}</p>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="md:col-span-2">
          {selectedCustomer ? (
            <Card>
              <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{selectedCustomer.phone}</p>
                  </div>
                  <Button onClick={() => handleAnalyze(selectedCustomer)} isLoading={selectedCustomer.isLoading}>
                    {selectedCustomer.isLoading ? 'Analyzing...' : 'Re-analyze with AI'}
                  </Button>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Risk Score</p>
                        <p className="text-3xl font-bold">{selectedCustomer.riskScore}</p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Predicted Repayment</p>
                        <p className="text-3xl font-bold">{selectedCustomer.predictedRepaymentDate}</p>
                    </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Credit History</h3>
                <ul className="mt-2 space-y-2">
                  {selectedCustomer.creditHistory.length > 0 ? selectedCustomer.creditHistory.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <span>${item.amount.toFixed(2)} on {item.date}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.paidOnTime ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {item.paidOnTime ? 'Paid on Time' : 'Paid Late'}
                      </span>
                    </li>
                  )) : <p className="text-gray-500">No credit history available.</p>}
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full min-h-[400px]">
              <p className="text-gray-500">Select a customer to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditManager;
