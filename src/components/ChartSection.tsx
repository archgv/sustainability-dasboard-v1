import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { Project, availableKPIs } from '@/types/project';
import { ChartType, EmbodiedCarbonBreakdown, ValueType } from './ChartTypeSelector';

interface ChartSectionProps {
  projects: Project[];
  chartType: ChartType;
  selectedKPI1: string;
  selectedKPI2: string;
  embodiedCarbonBreakdown: EmbodiedCarbonBreakdown;
  valueType: ValueType;
}

export const ChartSection = ({ 
  projects, 
  chartType, 
  selectedKPI1, 
  selectedKPI2, 
  embodiedCarbonBreakdown,
  valueType
}: ChartSectionProps) => {
  const kpi1Config = availableKPIs.find(kpi => kpi.key === selectedKPI1);
  const kpi2Config = availableKPIs.find(kpi => kpi.key === selectedKPI2);

  // Mock building area data for demonstration
  const getProjectArea = (projectId: string): number => {
    const areas: Record<string, number> = {
      '1': 15000, // Green Office Tower
      '2': 8500,  // Sustainable Housing Complex
      '3': 22000, // Innovation Campus
      '4': 12000, // Community Health Center
      '5': 18000  // Urban Retail Hub
    };
    return areas[projectId] || 10000;
  };

  const transformDataForValueType = (data: any[]) => {
    if (valueType === 'per-sqm') {
      return data; // Data is already per sqm in our KPIs
    }
    
    // For total values, multiply by building area
    return data.map(item => ({
      ...item,
      [selectedKPI1]: item[selectedKPI1] * getProjectArea(item.id),
      [selectedKPI2]: selectedKPI2 ? item[selectedKPI2] * getProjectArea(item.id) : undefined
    }));
  };

  const handleExportChart = () => {
    const chartTitle = getChartTitle();
    let chartContent = `${chartTitle}\n\n`;
    
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const breakdownData = getEmbodiedCarbonBreakdownData();
      chartContent += breakdownData.map(item => 
        `${item.name}: ${item.value} ${valueType === 'per-sqm' ? 'kgCO2e/m²' : 'kgCO2e total'}`
      ).join('\n');
    } else {
      const transformedProjects = transformDataForValueType(projects);
      chartContent += transformedProjects.map(project => 
        `${project.name}: ${project[selectedKPI1 as keyof Project]} ${getUnitLabel(kpi1Config?.unit || '', valueType)}` +
        (chartType === 'compare-bubble' ? ` | ${project[selectedKPI2 as keyof Project]} ${getUnitLabel(kpi2Config?.unit || '', valueType)}` : '')
      ).join('\n');
    }
    
    const blob = new Blob([chartContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-data-${selectedKPI1}-${valueType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getUnitLabel = (baseUnit: string, valueType: ValueType): string => {
    if (valueType === 'total') {
      return baseUnit.replace('/m²', '').replace('/year', '/year total');
    }
    return baseUnit;
  };

  const getChartTitle = () => {
    const valueTypeLabel = valueType === 'per-sqm' ? 'per sqm' : 'total';
    
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const breakdownType = embodiedCarbonBreakdown === 'lifecycle' ? 'Lifecycle Stage' : 'Building Element';
      return `Embodied Carbon by ${breakdownType} (${valueTypeLabel}) - Bar Chart`;
    }
    
    switch (chartType) {
      case 'compare-bubble':
        return `${kpi1Config?.label} vs ${kpi2Config?.label} (${valueTypeLabel}) - Bubble Chart`;
      case 'single-bar':
        return `${kpi1Config?.label} by Project (${valueTypeLabel}) - Bar Chart`;
      case 'single-timeline':
        return `${kpi1Config?.label} Over Time (${valueTypeLabel}) - Timeline`;
      default:
        return 'Chart';
    }
  };

  const getEmbodiedCarbonBreakdownData = () => {
    if (embodiedCarbonBreakdown === 'none') return [];
    
    const projectsWithBreakdown = projects.filter(p => p.embodiedCarbonBreakdown);
    
    if (projectsWithBreakdown.length === 0) return [];
    
    const breakdownKey = embodiedCarbonBreakdown === 'lifecycle' ? 'byLifeCycleStage' : 'byBuildingElement';
    const aggregatedData: Record<string, number[]> = {};
    
    projectsWithBreakdown.forEach(project => {
      const breakdown = project.embodiedCarbonBreakdown![breakdownKey];
      Object.entries(breakdown).forEach(([key, value]) => {
        if (!aggregatedData[key]) aggregatedData[key] = [];
        const finalValue = valueType === 'total' ? value * getProjectArea(project.id) : value;
        aggregatedData[key].push(finalValue);
      });
    });
    
    return Object.entries(aggregatedData).map(([key, values]) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const name = embodiedCarbonBreakdown === 'lifecycle' 
        ? getLifeCycleStageName(key)
        : key.charAt(0).toUpperCase() + key.slice(1);
      
      return {
        name,
        value: Math.round(average * 100) / 100
      };
    });
  };

  const getLifeCycleStageName = (stage: string): string => {
    const stageNames: Record<string, string> = {
      a1a3: 'Product Stage',
      a4: 'Transport',
      a5: 'Construction',
      b1b7: 'Use Stage',
      c1c4: 'End of Life',
      d: 'Benefits Beyond System'
    };
    return stageNames[stage] || stage.toUpperCase();
  };

  const renderChart = () => {
    // Handle embodied carbon breakdown
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const breakdownData = getEmbodiedCarbonBreakdownData();
      
      if (breakdownData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No breakdown data available for selected projects</div>;
      }
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={breakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              label={{ value: valueType === 'per-sqm' ? 'kgCO2e/m²' : 'kgCO2e total', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} ${valueType === 'per-sqm' ? 'kgCO2e/m²' : 'kgCO2e total'}`, 'Average Carbon']}
              labelFormatter={(label) => `${embodiedCarbonBreakdown === 'lifecycle' ? 'Stage' : 'Element'}: ${label}`}
            />
            <Bar 
              dataKey="value"
              fill="#10B981" 
              name="Average Embodied Carbon"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    const transformedProjects = transformDataForValueType(projects);

    switch (chartType) {
      case 'compare-bubble':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey={selectedKPI1}
                name={kpi1Config?.label || selectedKPI1}
                unit={` ${getUnitLabel(kpi1Config?.unit || '', valueType)}`}
              />
              <YAxis 
                type="number" 
                dataKey={selectedKPI2}
                name={kpi2Config?.label || selectedKPI2}
                unit={` ${getUnitLabel(kpi2Config?.unit || '', valueType)}`}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const area = getProjectArea(data.id);
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-600">{data.typology}</p>
                        <p className="text-sm">Area: {area.toLocaleString()} m²</p>
                        <p className="text-sm">
                          {kpi1Config?.label}: {data[selectedKPI1]} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                        </p>
                        <p className="text-sm">
                          {kpi2Config?.label}: {data[selectedKPI2]} {getUnitLabel(kpi2Config?.unit || '', valueType)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Projects" 
                data={transformedProjects}
                fill="#3b82f6"
                fillOpacity={0.6}
              >
                {transformedProjects.map((project, index) => {
                  const area = getProjectArea(project.id);
                  const bubbleSize = valueType === 'per-sqm' ? Math.sqrt(area / 500) : 8;
                  return (
                    <Scatter key={index} r={Math.max(4, Math.min(20, bubbleSize))} />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'single-bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transformedProjects} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                label={{ value: getUnitLabel(kpi1Config?.unit || '', valueType), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [
                  `${value} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
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
        const timelineData = transformedProjects
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
                label={{ value: getUnitLabel(kpi1Config?.unit || '', valueType), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [
                  `${value} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
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
