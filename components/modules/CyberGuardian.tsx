
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SecurityScanResult } from '../../types';
import { generateCyberGuardianReport } from '../../services/geminiService';

const CyberGuardian: React.FC = () => {
  const [networkDescription, setNetworkDescription] = useState('Our office uses a TP-Link router with the default wifi password "admin". We have a public server with port 21 open for FTP access.');
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!networkDescription) return;
    setIsLoading(true);
    setScanResult(null);
    const result = await generateCyberGuardianReport(networkDescription);
    setScanResult(result);
    setIsLoading(false);
  };
  
  const getRiskColor = (risk: 'High' | 'Medium' | 'Low') => {
      switch(risk) {
          case 'High': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
          case 'Medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
          case 'Low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI CyberGuardian</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card header={<h2 className="text-xl font-semibold">Network Analysis</h2>}>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Describe your business network setup, and the AI will scan for potential vulnerabilities and provide actionable security advice.
              </p>
              <textarea
                value={networkDescription}
                onChange={(e) => setNetworkDescription(e.target.value)}
                rows={5}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g., We use a Netgear router, password is 'password123', and we have a server open to the internet..."
              />
              <Button onClick={handleScan} isLoading={isLoading} className="w-full">
                {isLoading ? 'Scanning...' : 'Run AI Security Scan'}
              </Button>
            </div>
          </Card>
        </div>
        <div>
          <Card header={<h2 className="text-xl font-semibold">Security Report</h2>}>
            {isLoading && <p className="text-center">Generating report...</p>}
            {scanResult && (
              <div className="space-y-4">
                 <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Security Score</p>
                    <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{scanResult.score}/100</p>
                </div>
                {scanResult.vulnerabilities.map((vuln, index) => (
                    <div key={index} className={`p-3 border-l-4 rounded-r-md ${getRiskColor(vuln.risk)}`}>
                        <h3 className="font-bold">{vuln.title} <span className="text-sm font-medium">({vuln.risk} Risk)</span></h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{vuln.description}</p>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2 font-medium"><strong>Action:</strong> {vuln.recommendation}</p>
                    </div>
                ))}
              </div>
            )}
            {!isLoading && !scanResult && <p className="text-center text-gray-500">Run a scan to see the report.</p>}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CyberGuardian;
