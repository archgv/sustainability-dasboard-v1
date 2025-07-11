
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
    { value: 'upfrontCarbon', label: 'Upfront Carbon', unit: 'kgCO2e/m²', totalUnit: 'tCO2e' },
    { value: 'totalEmbodiedCarbon', label: 'Total Embodied Carbon', unit: 'kgCO2e/m²', totalUnit: 'tCO2e' },
    { value: 'refrigerants', label: 'Refrigerants', unit: 'kgCO2e/m²', totalUnit: 'tCO2e' },
    { value: 'operationalEnergy', label: 'Operational Energy', unit: 'kWh/m²/yr', totalUnit: 'MWh/yr' },
    { value: 'gasUsage', label: 'Gas Usage', unit: 'kWh/m²/yr', totalUnit: 'MWh/yr' },
    { value: 'biodiversityNetGain', label: 'Biodiversity Net Gain', unit: '%', totalUnit: '%' },
    { value: 'habitatUnits', label: 'Habitat Units Gained', unit: 'units', totalUnit: 'units' },
    { value: 'urbanGreeningFactor', label: 'Urban Greening Factor', unit: 'score', totalUnit: 'score' }
  ];

  const currentKPI = kpiOptions.find(kpi => kpi.value === selectedKPI);

  const allSectors = ['Residential', 'Education', 'Healthcare', 'Infrastructure', 'CCC', 'Commercial'];

  // Map typologies to the correct sectors
  const getSector = (typology: string) => {
    const sectorMap: { [key: string]: string } = {
      'residential': 'Residential',
      'educational': 'Education',
      'healthcare': 'Healthcare',
      'infrastructure': 'Infrastructure',
      'ccc': 'CCC',
      'office': 'Commercial',
      'retail': 'Commercial',
      'mixed-use': 'Commercial'
    };
    return sectorMap[typology] || 'Commercial';
  };

  // Filter projects by year if needed
  const filteredProjects = yearFilter === 'all' ? projects : projects.filter(project => {
    const projectYear = new Date(project.completionDate).getFullYear();
    const filterYear = parseInt(yearFilter.replace('from-', ''));
    return projectYear >= filterYear;
  });

  const sectorStats = filteredProjects.reduce((acc: any, project: any) => {
    const sector = getSector(project.typology);
    if (!acc[sector]) {
      acc[sector] = {
        count: 0,
        totalValue: 0,
        totalGIA: 0,
        minValue: Infinity,
        maxValue: -Infinity,
        values: []
      };
    }
    
    acc[sector].count++;
    const value = project[selectedKPI] || 0;
    const gia = project.gia || 0;
    
    if (valueType === 'total' && gia > 0) {
      let totalValue = value * gia;
      // Convert to appropriate units for totals
      if (selectedKPI === 'upfrontCarbon' || selectedKPI === 'totalEmbodiedCarbon' || selectedKPI === 'refrigerants') {
        totalValue = totalValue / 1000; // Convert kg to tonnes
      } else if (selectedKPI === 'operationalEnergy' || selectedKPI === 'gasUsage') {
        totalValue = totalValue / 1000; // Convert kWh to MWh
      }
      
      acc[sector].totalValue += totalValue;
      acc[sector].minValue = Math.min(acc[sector].minValue, totalValue);
      acc[sector].maxValue = Math.max(acc[sector].maxValue, totalValue);
      acc[sector].values.push(totalValue);
    } else {
      acc[sector].totalValue += value;
      acc[sector].minValue = Math.min(acc[sector].minValue, value);
      acc[sector].maxValue = Math.max(acc[sector].maxValue, value);
      acc[sector].values.push(value);
    }
    
    acc[sector].totalGIA += gia;
    return acc;
  }, {});

  const getAverage = (total: number, count: number) => {
    return count > 0 ? Math.round(total / count) : 0;
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Create chart data ensuring all sectors are included
  const chartData = allSectors.map(sector => {
    const stats = sectorStats[sector];
    return {
      sector: sector,
      value: stats ? getAverage(stats.totalValue, stats.count) : 0,
      count: stats ? stats.count : 0
    };
  });

  const getYearOptions = () => {
    const years = projects.map(p => new Date(p.completionDate).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears;
  };

  const handleDownload = (format: 'csv' | 'pdf' | 'chart') => {
    console.log(`Downloading ${format} for sector performance analysis`);
    // Implementation would go here
  };

  const getDisplayUnit = () => {
    if (valueType === 'total') {
      return currentKPI?.totalUnit || '';
    }
    return currentKPI?.unit || '';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-xl font-semibold text-gray-900">Sector Performance Analysis</h2>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} />
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
                  {kpiOptions.map(kpi => (
                    <SelectItem key={kpi.value} value={kpi.value}>
                      {kpi.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-md p-1">
                <button 
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    valueType === 'per-sqm' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setValueType('per-sqm')}
                >
                  Per m²
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    valueType === 'total' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setValueType('total')}
                >
                  Total
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {getYearOptions().map(year => (
                    <SelectItem key={year} value={`from-${year}`}>
                      From {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => handleDownload('chart')} className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Chart
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('csv')} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('pdf')} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          {/* Chart Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentKPI?.label} by Sector ({getDisplayUnit()})
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis label={{ value: getDisplayUnit(), angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={value => [`${formatNumber(Number(value))} ${getDisplayUnit()}`, 'Average']} 
                    labelFormatter={label => `Sector: ${label}`} 
                  />
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
                  {allSectors.map(sector => {
                    const stats = sectorStats[sector];
                    const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
                    const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
                    const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
                    const range = max - min;
                    const count = stats ? stats.count : 0;
                    
                    return (
                      <tr key={sector}>
                        <td className="border border-gray-300 px-4 py-2 font-medium">{sector}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{count}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {formatNumber(avg)} {getDisplayUnit()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{formatNumber(min)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{formatNumber(max)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{formatNumber(range)}</td>
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
