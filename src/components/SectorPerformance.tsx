
import { useState } from 'react';
import { ChevronDown, Download, BarChart3, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorPerformanceProps {
  projects: any[];
}

export const SectorPerformance = ({ projects }: SectorPerformanceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState('totalEmbodiedCarbon');
  const [valueType, setValueType] = useState('per-sqm');
  const [yearFilter, setYearFilter] = useState('all');

  const kpiOptions = [
    { value: 'upfrontCarbon', label: 'Upfront Carbon', unit: 'kgCO2e/m²' },
    { value: 'totalEmbodiedCarbon', label: 'Total Embodied Carbon', unit: 'kgCO2e/m²' },
    { value: 'refrigerants', label: 'Refrigerants', unit: 'kgCO2e/m²' },
    { value: 'operationalEnergy', label: 'Operational Energy', unit: 'kWh/m²/yr' },
    { value: 'gasUsage', label: 'Gas Usage', unit: 'kWh/m²/yr' },
    { value: 'biodiversityNetGain', label: 'Biodiversity Net Gain', unit: '%' },
    { value: 'habitatUnits', label: 'Habitat Units Gained', unit: 'units' },
    { value: 'urbanGreeningFactor', label: 'Urban Greening Factor', unit: 'score' }
  ];

  const currentKPI = kpiOptions.find(kpi => kpi.value === selectedKPI);

  // Filter projects by year if needed
  const filteredProjects = yearFilter === 'all' ? projects : 
    projects.filter(project => {
      const projectYear = new Date(project.completionDate).getFullYear();
      return projectYear.toString() === yearFilter;
    });

  const typologyStats = filteredProjects.reduce((acc: any, project: any) => {
    const typology = project.typology;
    if (!acc[typology]) {
      acc[typology] = {
        count: 0,
        totalValue: 0,
        totalGIA: 0,
        minValue: Infinity,
        maxValue: -Infinity,
        values: []
      };
    }
    acc[typology].count++;
    const value = project[selectedKPI] || 0;
    const gia = project.gia || 0;
    
    if (valueType === 'total' && gia > 0) {
      const totalValue = value * gia;
      acc[typology].totalValue += totalValue;
      acc[typology].minValue = Math.min(acc[typology].minValue, totalValue);
      acc[typology].maxValue = Math.max(acc[typology].maxValue, totalValue);
      acc[typology].values.push(totalValue);
    } else {
      acc[typology].totalValue += value;
      acc[typology].minValue = Math.min(acc[typology].minValue, value);
      acc[typology].maxValue = Math.max(acc[typology].maxValue, value);
      acc[typology].values.push(value);
    }
    acc[typology].totalGIA += gia;
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

  const getYearOptions = () => {
    const years = projects.map(p => new Date(p.completionDate).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears;
  };

  const handleDownload = (format: 'csv' | 'pdf' | 'chart') => {
    console.log(`Downloading ${format} for sector performance analysis`);
    // Implementation would go here
  };

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
          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">KPI:</label>
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

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Value Type:</label>
              <Select value={valueType} onValueChange={setValueType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per-sqm">Per m²</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Year:</label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('chart')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Chart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('csv')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('pdf')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          {/* Chart Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentKPI?.label} by Sector {valueType === 'per-sqm' ? '(per m²)' : '(total)'}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis label={{ 
                    value: valueType === 'per-sqm' ? currentKPI?.unit : `Total ${currentKPI?.unit}`, 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} />
                  <Tooltip formatter={(value) => `${value} ${valueType === 'per-sqm' ? currentKPI?.unit : `Total ${currentKPI?.unit}`}`} />
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
                    const min = stats.minValue === Infinity ? 0 : Math.round(stats.minValue);
                    const max = stats.maxValue === -Infinity ? 0 : Math.round(stats.maxValue);
                    const range = max - min;
                    
                    return (
                      <tr key={typology}>
                        <td className="border border-gray-300 px-4 py-2 capitalize font-medium">{typology}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{stats.count}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {avg} {valueType === 'per-sqm' ? currentKPI?.unit : `Total ${currentKPI?.unit}`}
                        </td>
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
