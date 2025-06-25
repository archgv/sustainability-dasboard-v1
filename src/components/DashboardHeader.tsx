
import { Building2 } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sustainability Performance Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track environmental KPIs across all architectural projects
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Projects</div>
            <div className="text-2xl font-bold text-green-600">47</div>
          </div>
        </div>
      </div>
    </header>
  );
};
