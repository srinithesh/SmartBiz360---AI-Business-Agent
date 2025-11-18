
import React, { useState, useEffect } from 'react';
import { Property, Tenant } from '../../types';
import Card from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as api from '../../api';

const rentalIncomeData = [
  { name: 'Jan', income: 2000 }, { name: 'Feb', income: 2000 }, { name: 'Mar', income: 1200 },
  { name: 'Apr', income: 2000 }, { name: 'May', income: 2000 }, { name: 'Jun', income: 2000 },
];

const RentalManager: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [props, tens] = await Promise.all([api.getProperties(), api.getTenants()]);
        setProperties(props);
        setTenants(tens);
        setError(null);
      } catch (err) {
        setError("Failed to load rental data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <p>Loading rental data...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-on-surface">Rental Property Manager</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<h2 className="text-xl font-semibold">Tenant Overview</h2>}>
          <div className="space-y-4">
            {tenants.map(tenant => (
              <div key={tenant.id} className="p-3 bg-surface-variant/60 rounded-md">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-on-surface-variant">{tenant.name}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${tenant.pendingDues > 0 ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {tenant.pendingDues > 0 ? `Due: $${tenant.pendingDues}` : 'Paid'}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant/80">
                  Property: {properties.find(p => p.id === tenant.propertyId)?.name} | Rent: ${tenant.rentAmount}/mo
                </p>
                <p className="text-sm text-on-surface-variant/80">Contract ends: {tenant.contractExpiry}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card header={<h2 className="text-xl font-semibold">Rental Income Dashboard</h2>}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentalIncomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--md-sys-color-on-surface-variant)' }} />
                <YAxis tick={{ fill: 'var(--md-sys-color-on-surface-variant)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--md-sys-color-surface)', 
                    borderColor: 'var(--md-sys-color-outline)' 
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="var(--md-sys-color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RentalManager;