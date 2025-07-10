import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
      };
    }
    acc[typology].count++;
    acc[typology].totalCarbonIntensity += project.carbonIntensity;
    acc[typology].totalOperationalEnergy += project.operationalEnergy;
    return acc;
  }, {});

  const getAverage = (total: number, count: number) => {
    return count > 0 ? (total / count).toFixed(2) : '0';
  };

  return (
    <Card className="p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900">Sector Performance Analysis</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {Object.keys(typologyStats).length} sectors
          </span>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6">
          {Object.entries(typologyStats).map(([typology, stats]: [string, any]) => (
            <div key={typology} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 capitalize">{typology}</h3>
              <p className="text-sm text-gray-600">
                Average Carbon Intensity: {getAverage(stats.totalCarbonIntensity, stats.count)} kgCO2e/m²
              </p>
              <p className="text-sm text-gray-600">
                Average Operational Energy: {getAverage(stats.totalOperationalEnergy, stats.count)} kWh/m²/yr
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
