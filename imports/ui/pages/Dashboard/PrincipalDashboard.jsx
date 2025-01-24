import React from 'react';
import { CardIndicator } from './components/CardIndicator';
import LineChart from './components/LineChart';

export const PrincipalDashboard = () => {

    const customerId = "2";
  return (
    <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-4 lg:px-6">
            <div className="px-4 py-6 sm:px-0">
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="sm:flex sm:items-start sm:justify-between">
                            <CardIndicator/>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow sm:rounded-lg mt-4">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <LineChart/>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow sm:rounded-lg mt-4">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <LineChart customerId={customerId}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};