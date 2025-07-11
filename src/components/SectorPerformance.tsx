
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorPerformanceProps {
  projects: any[];
}

export const SectorPerformance = ({ projects }: SectorPerformanceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const typologyStats = projects.reduce((acc: any, project: any) => {
    const typology = project.typology;
    if (!acc[typology]) {
      acc[typology] = {
        count: 0,
        totalCarbonIntensity: 0,
        totalOperationalEnergy: 0,
        minCarbon: Infinity,
        maxCarbon: -Infinity,
        values: []
      };
    }
    acc[typology].count++;
    acc[typology].totalCarbonIntensity += project.totalEmbodiedCarbon;
    acc[typology].totalOperationalEnergy += project.operationalEnergy;
    acc[typology].minCarbon = Math.min(acc[typology].minCarbon, project.totalEmbodiedCarbon);
    acc[typology].maxCarbon = Math.max(acc[typology].maxCarbon, project.totalEmbodiedCarbon);
    acc[typology].values.push(project.totalEmbodiedCarbon);
    return acc;
  }, {});

  const getAverage = (total: number, count: number) => {
    return count > 0 ? Math.round(total / count) : 0;
  };

  const chartData = Object.entries(typologyStats).map(([typology, stats]: [string, any]) => ({
    sector: typology.charAt(0).toUpperCase() + typology.slice(1),
    value: getAverage(stats.totalCarbonIntensity, stats.count),
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
          {/* Chart Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance by Sector (per m²)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis label={{ value: 'kgCO2e/m²', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value} kgCO2e/m²`} />
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
                    const avg = getAverage(stats.totalCarbonIntensity, stats.count);
                    const min = stats.minCarbon === Infinity ? 0 : stats.minCarbon;
                    const max = stats.maxCarbon === -Infinity ? 0 : stats.maxCarbon;
                    const range = max - min;
                    
                    return (
                      <tr key={typology}>
                        <td className="border border-gray-300 px-4 py-2 capitalize font-medium">{typology}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{stats.count}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{avg} kgCO2e/m²</td>
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
