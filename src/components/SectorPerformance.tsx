import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ErrorBar } from 'recharts';
import { Download } from 'lucide-react';
import { Project, availableKPIs } from '@/types/project';
import { useState } from 'react';

interface SectorPerformanceProps {
  projects: Project[];
}

export const SectorPerformance = ({ projects }: SectorPerformanceProps) => {
  const [selectedKPI, setSelectedKPI] = useState('totalEmbodiedCarbon');
  const [valueType, setValueType] = useState<'per-sqm' | 'total'>('per-sqm');
  
  const kpiConfig = availableKPIs.find(kpi => kpi.key === selectedKPI);
  
  // Mock building area data for demonstration
  const getProjectArea = (projectId: string): number => {
    const areas: Record<string, number> = {
      '1': 15000, '2': 8500, '3': 22000, '4': 12000, '5': 18000
    };
    return areas[projectId] || 10000;
  };

  // Calculate sector statistics
  const sectorStats = projects.reduce((acc: any, project) => {
    const typology = project.typology;
    let value = project[selectedKPI as keyof Project] as number;
    
    // Convert to total if needed
    if (valueType === 'total') {
      value = value * getProjectArea(project.id);
    }
    
    if (!acc[typology]) {
      acc[typology] = [];
    }
    acc[typology].push(value);
    return acc;
  }, {});

  // Process data for bar chart visualization
  const chartData = Object.entries(sectorStats).map(([typology, values]: [string, number[]]) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const min = Math.min(...sortedValues);
    const max = Math.max(...sortedValues);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const range = max - min;
    
    return {
      typology: typology.charAt(0).toUpperCase() + typology.slice(1),
      average: Math.round(average * 100) / 100,
      min,
      max,
      range,
      count: values.length,
      errorMin: average - min,
      errorMax: max - average
    };
  });

  const getUnitLabel = (): string => {
    if (valueType === 'total') {
      return kpiConfig?.unit?.replace('/m²', '') || '';
    }
    return kpiConfig?.unit || '';
  };

  const handleExportCSV = () => {
    const csvHeaders = ['Typology', 'Count', 'Average', 'Min', 'Max', 'Range'];
    const csvData = chartData.map(row => [
      row.typology,
      row.count,
      row.average,
      row.min,
      row.max,
      row.range
    ]);
    
    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sector-performance-${selectedKPI}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const content = `Sector Performance Report - ${kpiConfig?.label}\n\n` +
      chartData.map(row => 
        `${row.typology.toUpperCase()}\n` +
        `Count: ${row.count}\n` +
        `Average: ${row.average} ${kpiConfig?.unit || ''}\n` +
        `Range: ${row.min} - ${row.max} ${kpiConfig?.unit || ''}\n\n`
      ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sector-performance-${selectedKPI}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportChart = () => {
    // Simple chart export as text data
    const chartContent = `Sector Performance Chart Data - ${kpiConfig?.label}\n\n` +
      chartData.map(row => 
        `${row.typology}: ${row.average} ${kpiConfig?.unit || ''} (Range: ${row.min}-${row.max})`
      ).join('\n');
    
    const blob = new Blob([chartContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sector-chart-${selectedKPI}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="sector-performance">
        <AccordionTrigger className="text-xl font-semibold text-gray-900 hover:no-underline">
          Sector Performance Analysis
        </AccordionTrigger>
        <AccordionContent>
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4 items-center">
                <Select value={selectedKPI} onValueChange={setSelectedKPI}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKPIs.filter(kpi => kpi.numericOnly).map((kpi) => (
                      <SelectItem key={kpi.key} value={kpi.key}>
                        {kpi.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex rounded-md border border-gray-300 bg-white">
                  <button
                    onClick={() => setValueType('per-sqm')}
                    className={`px-3 py-2 text-sm font-medium rounded-l-md transition-colors ${
                      valueType === 'per-sqm'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Per m²
                  </button>
                  <button
                    onClick={() => setValueType('total')}
                    className={`px-3 py-2 text-sm font-medium rounded-r-md border-l transition-colors ${
                      valueType === 'total'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    Total
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportChart}>
                  <Download className="w-4 h-4 mr-2" />
                  Chart
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            <div className="h-96">
              <h3 className="text-lg font-medium mb-4">Performance by Sector ({valueType === 'per-sqm' ? 'per m²' : 'total'})</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="typology" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis 
                    label={{ value: getUnitLabel(), angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value} ${getUnitLabel()}`,
                      name === 'average' ? 'Average' : name
                    ]}
                    labelFormatter={(label) => `Sector: ${label}`}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-300 rounded p-3 shadow-lg">
                            <p className="font-medium">{`${label}`}</p>
                            <p className="text-blue-600">{`Average: ${data.average} ${getUnitLabel()}`}</p>
                            <p className="text-gray-600">{`Range: ${data.min} - ${data.max} ${getUnitLabel()}`}</p>
                            <p className="text-gray-500">{`Projects: ${data.count}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="average" fill="#3b82f6" name="Average">
                    <ErrorBar dataKey="errorMin" width={4} strokeWidth={2} stroke="#666" direction="y" />
                    <ErrorBar dataKey="errorMax" width={4} strokeWidth={2} stroke="#666" direction="y" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary table below chart */}
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Summary Statistics</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-left">Sector</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Projects</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Average</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Min</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Max</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((sector) => (
                      <tr key={sector.typology} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 font-medium">{sector.typology}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{sector.count}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                          {sector.average} {getUnitLabel()}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{sector.min}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{sector.max}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{sector.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
