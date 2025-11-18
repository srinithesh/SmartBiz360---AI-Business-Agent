
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const TallyIntegration: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    // TODO: Implement actual API call to backend for Tally sync
    setTimeout(() => {
      alert("Invoice data sync initiated with Tally ERP.");
      setIsSyncing(false);
    }, 1500);
  };

  const handleGenerateEWay = () => {
    setIsGenerating(true);
    // TODO: Implement actual API call to backend for e-way bill
    setTimeout(() => {
      alert("E-Way bill generation request sent.");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tally ERP Integration</h1>
      <Card header={<h2 className="text-xl font-semibold">Data Synchronization</h2>}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Automate your accounting by syncing invoice data directly to Tally ERP and generating e-way bills with a single click.
          </p>
          <div className="flex space-x-4">
            <Button onClick={handleSync} isLoading={isSyncing}>
              Sync Invoice Data
            </Button>
            <Button onClick={handleGenerateEWay} isLoading={isGenerating} variant="secondary">
              Generate E-Way Bill
            </Button>
          </div>
           <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
            <strong>Note:</strong> This is a placeholder for a real API integration. Clicking these buttons simulates a request to a backend service.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TallyIntegration;
