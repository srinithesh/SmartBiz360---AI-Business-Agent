
import React, { useState, useEffect } from 'react';
import { ComplianceItem } from '../../types';
import Card from '../ui/Card';
import * as api from '../../api';

const ComplianceHub: React.FC = () => {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedItems = await api.getComplianceItems();
        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        setError("Failed to load compliance data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDaysLeft = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compliance Reminder Hub</h1>
      <Card>
        {isLoading ? (
          <p className="p-4 text-center">Loading compliance items...</p>
        ) : error ? (
          <p className="p-4 text-center text-red-500">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(item => {
              const daysLeft = getDaysLeft(item.dueDate);
              const isOverdue = daysLeft < 0;
              const isSoon = daysLeft <= 7 && daysLeft >= 0;

              return (
                <li key={item.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category: {item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isOverdue ? 'text-red-500' : isSoon ? 'text-yellow-500' : ''}`}>
                      {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days left`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Due: {item.dueDate}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default ComplianceHub;
