
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BoxPlot, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import { Project, availableKPIs } from '@/types/project';
import { useState } from 'react';

interface SectorPerformanceProps {
  projects: Project[];
}

export const SectorPerformance = ({ projects }: SectorPerformanceProps) => {
  const [selectedKPI, setSelectedKPI] = useState('totalEmbodiedCarbon');
  
  const kpiConfig = availableKPIs.find(kpi => kpi.key === selectedKPI);
  
  // Calculate sector statistics
  const sectorStats = projects.reduce((acc: any, project) => {
    const typology = project.typology;
    const value = project[selectedKPI as keyof Project] as number;
    
    if (!acc[typology]) {
      acc[typology] = [];
    }
    acc[typology].push(value);
    return acc;
  }, {});

  // Process data for box plot visualization
  const boxPlotData = Object.entries(sectorStats).map(([typology, values]: [string, number[]]) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
    const median = sortedValues[Math.floor(sortedValues.length * 0.5)];
    const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
    const min = Math.min(...sortedValues);
    const max = Math.max(...sortedValues);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calculate IQR and outliers
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const outliers = sortedValues.filter(val => val < lowerFence || val > upperFence);
    
    return {
      typology,
      min,
      q1,
      median,
      q3,
      max,
      average: Math.round(average * 100) / 100,
      outliers,
      count: values.length
    };
  });

  const handleExportCSV = () => {
    const csvHeaders = ['Typology', 'Count', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Average', 'Outliers'];
    const csvData = boxPlotData.map(row => [
      row.typology,
      row.count,
      row.min,
      row.q1,
      row.median,
      row.q3,
      row.max,
      row.average,
      row.outliers.join(';')
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
    // For now, we'll create a simple text export. In a real app, you'd use a PDF library
    const content = `Sector Performance Report - ${kpiConfig?.label}\n\n` +
      boxPlotData.map(row => 
        `${row.typology.toUpperCase()}\n` +
        `Count: ${row.count}\n` +
        `Average: ${row.average} ${kpiConfig?.unit || ''}\n` +
        `Range: ${row.min} - ${row.max} ${kpiConfig?.unit || ''}\n` +
        `Median: ${row.median} ${kpiConfig?.unit || ''}\n\n`
      ).join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sector-performance-${selectedKPI}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sector Performance Analysis</h2>
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
          <div className="flex gap-2">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box Plot Visualization */}
        <div className="h-80">
          <h3 className="text-lg font-medium mb-4">Distribution by Sector</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {boxPlotData.map((sector) => (
              <div key={sector.typology} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium capitalize mb-2">{sector.typology}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Count:</span>
                    <span className="font-medium">{sector.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg:</span>
                    <span className="font-medium">{sector.average} {kpiConfig?.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Range:</span>
                    <span className="font-medium">{sector.min} - {sector.max}</span>
                  </div>
                  {sector.outliers.length > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Outliers:</span>
                      <span className="font-medium">{sector.outliers.length}</span>
                    </div>
                  )}
                </div>
                
                {/* Simple visual box plot */}
                <div className="mt-3 h-8 relative bg-white rounded border">
                  <div 
                    className="absolute bg-blue-200 h-full rounded"
                    style={{
                      left: `${((sector.q1 - sector.min) / (sector.max - sector.min)) * 100}%`,
                      width: `${((sector.q3 - sector.q1) / (sector.max - sector.min)) * 100}%`
                    }}
                  />
                  <div 
                    className="absolute w-0.5 bg-blue-600 h-full"
                    style={{
                      left: `${((sector.median - sector.min) / (sector.max - sector.min)) * 100}%`
                    }}
                  />
                  <div 
                    className="absolute w-0.5 bg-gray-400 h-full"
                    style={{ left: '0%' }}
                  />
                  <div 
                    className="absolute w-0.5 bg-gray-400 h-full"
                    style={{ right: '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        <div>
          <h3 className="text-lg font-medium mb-4">Performance Summary</h3>
          <div className="space-y-4">
            {boxPlotData
              .sort((a, b) => a.average - b.average)
              .map((sector, index) => (
                <div 
                  key={sector.typology}
                  className={`p-4 rounded-lg border-l-4 ${
                    index === 0 
                      ? 'border-green-500 bg-green-50' 
                      : index === boxPlotData.length - 1 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{sector.typology}</span>
                    <span className="text-lg font-bold">
                      {sector.average} {kpiConfig?.unit}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {index === 0 && '🏆 Best performing sector'}
                    {index === boxPlotData.length - 1 && '📈 Highest values'}
                    {index !== 0 && index !== boxPlotData.length - 1 && `${sector.count} projects`}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
