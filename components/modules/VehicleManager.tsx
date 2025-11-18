
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../../types';
import Card from '../ui/Card';
import * as api from '../../api';

const VehicleManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedVehicles = await api.getVehicles();
        setVehicles(fetchedVehicles);
        setError(null);
      } catch (err) {
        setError("Failed to load vehicle data.");
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
  
  const ReminderItem: React.FC<{label: string; date: string}> = ({label, date}) => {
    const daysLeft = getDaysLeft(date);
    const isOverdue = daysLeft < 0;
    const isSoon = daysLeft <= 30 && daysLeft >= 0;
    
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">{label}:</span>
            <span className={`font-medium ${isOverdue ? 'text-red-500' : isSoon ? 'text-yellow-500' : ''}`}>
                {date} ({daysLeft > 0 ? `${daysLeft} days left` : `overdue ${Math.abs(daysLeft)} days`})
            </span>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicle Reminder System</h1>
      {isLoading ? (
        <p>Loading vehicles...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map(vehicle => (
            <Card key={vehicle.id} header={
              <div>
                <h2 className="text-xl font-semibold">{vehicle.name}</h2>
                <p className="text-sm font-mono text-gray-500 dark:text-gray-400">{vehicle.number}</p>
              </div>
            }>
              <div className="space-y-2">
                  <ReminderItem label="Insurance" date={vehicle.insuranceExpiry} />
                  <ReminderItem label="PUC" date={vehicle.pucExpiry} />
                  <ReminderItem label="Fitness Cert (FC)" date={vehicle.fcExpiry} />
                  <ReminderItem label="Road Tax" date={vehicle.roadTaxExpiry} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleManager;
