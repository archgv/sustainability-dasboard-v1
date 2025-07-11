
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorPerformanceProps {
  projects: any[];
}

export const SectorPerformance = ({ projects }: SectorPerformanceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState('totalEmbodiedCarbon');

  const kpiOptions = [
    { value: 'totalEmbodiedCarbon', label: 'Total Embodied Carbon', unit: 'kgCO2e/m²' },
    { value: 'operationalEnergy', label: 'Operational Energy', unit: 'kWh/m²/yr' },
    { value: 'carbonIntensity', label: 'Carbon Intensity', unit: 'kgCO2e/m²' }
  ];

  const currentKPI = kpiOptions.find(kpi => kpi.value === selectedKPI);

  const typologyStats = projects.reduce((acc: any, project: any) => {
    const typology = project.typology;
    if (!acc[typology]) {
      acc[typology] = {
        count: 0,
        totalValue: 0,
        minValue: Infinity,
        maxValue: -Infinity,
        values: []
      };
    }
    acc[typology].count++;
    const value = project[selectedKPI] || 0;
    acc[typology].totalValue += value;
    acc[typology].minValue = Math.min(acc[typology].minValue, value);
    acc[typology].maxValue = Math.max(acc[typology].maxValue, value);
    acc[typology].values.push(value);
    return acc;
  }, {});

  const getAverage = (total: number, count: number) => {
    return count > 0 ? Math.round(total / count) : 0;
  };

  const chartData = Object.entries(typologyStats).map(([typology, stats]: [string, any]) => ({
    sector: typology.charAt(0).toUpperCase() + typology.slice(1),
    value: getAverage(stats.totalValue, stats.count),
    count: stats.count
  }));

  return (
    <Card className="p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900">Sector Performance Analysis</h2>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`} 
        />
      </div>
      
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* KPI Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Select KPI:
            </label>
            <Select value={selectedKPI} onValueChange={setSelectedKPI}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kpiOptions.map((kpi) => (
                  <SelectItem key={kpi.value} value={kpi.value}>
                    {kpi.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chart Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentKPI?.label} by Sector (per m²)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis label={{ value: currentKPI?.unit, angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value} ${currentKPI?.unit}`} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Statistics Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Sector</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Projects</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Average</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Min</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Max</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(typologyStats).map(([typology, stats]: [string, any]) => {
                    const avg = getAverage(stats.totalValue, stats.count);
                    const min = stats.minValue === Infinity ? 0 : stats.minValue;
                    const max = stats.maxValue === -Infinity ? 0 : stats.maxValue;
                    const range = max - min;
                    
                    return (
                      <tr key={typology}>
                        <td className="border border-gray-300 px-4 py-2 capitalize font-medium">{typology}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{stats.count}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{avg} {currentKPI?.unit}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{min}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{max}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{range}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
