
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { Project, availableKPIs } from '@/types/project';
import { ChartType } from './ChartTypeSelector';

interface ChartSectionProps {
  projects: Project[];
  chartType: ChartType;
  selectedKPI1: string;
  selectedKPI2: string;
}

export const ChartSection = ({ projects, chartType, selectedKPI1, selectedKPI2 }: ChartSectionProps) => {
  const kpi1Config = availableKPIs.find(kpi => kpi.key === selectedKPI1);
  const kpi2Config = availableKPIs.find(kpi => kpi.key === selectedKPI2);

  const handleExportChart = () => {
    const chartTitle = getChartTitle();
    const chartContent = `${chartTitle}\n\n` + 
      projects.map(project => 
        `${project.name}: ${project[selectedKPI1 as keyof Project]} ${kpi1Config?.unit || ''}` +
        (chartType.includes('compare') ? ` | ${project[selectedKPI2 as keyof Project]} ${kpi2Config?.unit || ''}` : '')
      ).join('\n');
    
    const blob = new Blob([chartContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-data-${selectedKPI1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'compare-scatter':
        return `${kpi1Config?.label} vs ${kpi2Config?.label} - Scatter Plot`;
      case 'compare-bubble':
        return `${kpi1Config?.label} vs ${kpi2Config?.label} - Bubble Chart`;
      case 'single-bar':
        return `${kpi1Config?.label} by Project - Bar Chart`;
      case 'single-timeline':
        return `${kpi1Config?.label} Over Time - Timeline`;
      default:
        return 'Chart';
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'compare-scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey={selectedKPI1}
                name={kpi1Config?.label || selectedKPI1}
                unit={kpi1Config?.unit ? ` ${kpi1Config.unit}` : ''}
              />
              <YAxis 
                type="number" 
                dataKey={selectedKPI2}
                name={kpi2Config?.label || selectedKPI2}
                unit={kpi2Config?.unit ? ` ${kpi2Config.unit}` : ''}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-600">{data.typology}</p>
                        <p className="text-sm">
                          {kpi1Config?.label}: {data[selectedKPI1]} {kpi1Config?.unit}
                        </p>
                        <p className="text-sm">
                          {kpi2Config?.label}: {data[selectedKPI2]} {kpi2Config?.unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Projects" 
                data={projects} 
                fill="#3b82f6"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'compare-bubble':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey={selectedKPI1}
                name={kpi1Config?.label || selectedKPI1}
                unit={kpi1Config?.unit ? ` ${kpi1Config.unit}` : ''}
              />
              <YAxis 
                type="number" 
                dataKey={selectedKPI2}
                name={kpi2Config?.label || selectedKPI2}
                unit={kpi2Config?.unit ? ` ${kpi2Config.unit}` : ''}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-600">{data.typology}</p>
                        <p className="text-sm">
                          {kpi1Config?.label}: {data[selectedKPI1]} {kpi1Config?.unit}
                        </p>
                        <p className="text-sm">
                          {kpi2Config?.label}: {data[selectedKPI2]} {kpi2Config?.unit}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Projects" 
                data={projects} 
                fill="#3b82f6"
                fillOpacity={0.6}
                r={8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'single-bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projects} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                label={{ value: kpi1Config?.unit || '', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [
                  `${value} ${kpi1Config?.unit || ''}`,
                  kpi1Config?.label || selectedKPI1
                ]}
                labelFormatter={(label) => `Project: ${label}`}
              />
              <Bar 
                dataKey={selectedKPI1}
                fill="#3b82f6" 
                name={kpi1Config?.label || selectedKPI1}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'single-timeline':
        const timelineData = projects
          .map(project => ({
            ...project,
            date: new Date(project.completionDate).getTime()
          }))
          .sort((a, b) => a.date - b.date);

        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="completionDate"
                type="category"
              />
              <YAxis 
                label={{ value: kpi1Config?.unit || '', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [
                  `${value} ${kpi1Config?.unit || ''}`,
                  kpi1Config?.label || selectedKPI1
                ]}
                labelFormatter={(label) => `Completion: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey={selectedKPI1}
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Select a chart type to view data</div>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{getChartTitle()}</h2>
        <Button variant="outline" size="sm" onClick={handleExportChart}>
          <Download className="w-4 h-4 mr-2" />
          Export Chart
        </Button>
      </div>
      
      <div className="h-96">
        {renderChart()}
      </div>
    </Card>
  );
};
