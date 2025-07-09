
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { Project, availableKPIs } from '@/types/project';
import { ChartType, EmbodiedCarbonBreakdown, ValueType } from './ChartTypeSelector';
import { addProjectNumberToName } from '@/utils/projectUtils';

interface ChartSectionProps {
  projects: Project[];
  chartType: ChartType;
  selectedKPI1: string;
  selectedKPI2: string;
  embodiedCarbonBreakdown: EmbodiedCarbonBreakdown;
  valueType: ValueType;
  isComparingToSelf?: boolean;
  selectedRibaStages?: string[];
}

export const ChartSection = ({ 
  projects, 
  chartType, 
  selectedKPI1, 
  selectedKPI2, 
  embodiedCarbonBreakdown,
  valueType,
  isComparingToSelf = false,
  selectedRibaStages = []
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
      [selectedKPI1]: item[selectedKPI1] * getProjectArea(item.id.split('-')[0]), // Handle RIBA stage variants
      [selectedKPI2]: selectedKPI2 ? item[selectedKPI2] * getProjectArea(item.id.split('-')[0]) : undefined
    }));
  };

  const handleExportChart = () => {
    const chartTitle = getChartTitle();
    let chartContent = `${chartTitle}\n\n`;
    
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const breakdownData = getEmbodiedCarbonStackedData();
      chartContent += breakdownData.map(item => {
        const projectName = item.name;
        const categories = Object.keys(item).filter(key => key !== 'name');
        return `${projectName}:\n` + categories.map(cat => `  ${cat}: ${item[cat]} ${valueType === 'per-sqm' ? 'kgCO2e/m²' : 'kgCO2e total'}`).join('\n');
      }).join('\n\n');
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
      return `Embodied Carbon by ${breakdownType} (${valueTypeLabel}) - Stacked Column Chart`;
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

  const getLifecycleStageCategories = () => [
    { key: 'biogenicCarbon', label: 'Biogenic carbon (A1-A3)', color: '#22c55e' },
    { key: 'upfrontEmbodied', label: 'Upfront embodied carbon (A1-A5)', color: '#3b82f6' },
    { key: 'inUseEmbodied', label: 'In-use embodied carbon (B1-B5)', color: '#f59e0b' },
    { key: 'endOfLife', label: 'End of life (C1-C4)', color: '#ef4444' },
    { key: 'benefitsLoads', label: 'Benefits and loads (D1)', color: '#8b5cf6' },
    { key: 'facilitatingWorks', label: 'Facilitating works', color: '#06b6d4' }
  ];

  const getBuildingElementCategories = () => [
    { key: 'substructure', label: 'Substructure', color: '#22c55e' },
    { key: 'superstructureFrame', label: 'Superstructure - Frame', color: '#3b82f6' },
    { key: 'superstructureExternal', label: 'Superstructure - External envelope', color: '#f59e0b' },
    { key: 'superstructureInternal', label: 'Superstructure - Internal assemblies', color: '#ef4444' },
    { key: 'finishes', label: 'Finishes', color: '#8b5cf6' },
    { key: 'ffe', label: 'FF&E', color: '#06b6d4' },
    { key: 'mep', label: 'MEP', color: '#ec4899' },
    { key: 'externalWorks', label: 'External works', color: '#10b981' },
    { key: 'contingency', label: 'Contingency', color: '#6b7280' }
  ];

  const getEmbodiedCarbonStackedData = () => {
    if (embodiedCarbonBreakdown === 'none' || projects.length === 0) return [];
    
    const categories = embodiedCarbonBreakdown === 'lifecycle' 
      ? getLifecycleStageCategories()
      : getBuildingElementCategories();
    
    return projects.map(project => {
      const baseId = project.id.split('-')[0];
      const displayName = isComparingToSelf && project.ribaStage 
        ? `${addProjectNumberToName(project.name, parseInt(baseId) - 1)} (RIBA ${project.ribaStage.replace('stage-', '')})`
        : addProjectNumberToName(project.name, parseInt(baseId) - 1);
      
      const projectData: any = { name: displayName };
      
      // Mock breakdown data - in real app this would come from project.embodiedCarbonBreakdown
      categories.forEach((category, index) => {
        // Generate mock values based on total embodied carbon
        const baseValue = project.totalEmbodiedCarbon || 45;
        const multiplier = embodiedCarbonBreakdown === 'lifecycle' 
          ? [0.4, 0.15, 0.25, 0.1, 0.05, 0.05][index] // Lifecycle distribution
          : [0.15, 0.2, 0.15, 0.1, 0.05, 0.05, 0.15, 0.1, 0.05][index]; // Building element distribution
        
        const categoryValue = baseValue * (multiplier || 0.1);
        const finalValue = valueType === 'total' ? categoryValue * getProjectArea(baseId) : categoryValue;
        projectData[category.key] = Math.round(finalValue * 100) / 100;
      });
      
      return projectData;
    });
  };

  const renderChart = () => {
    // Handle embodied carbon breakdown with stacked columns
    if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
      const stackedData = getEmbodiedCarbonStackedData();
      
      if (stackedData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No breakdown data available for selected projects</div>;
      }
      
      const categories = embodiedCarbonBreakdown === 'lifecycle' 
        ? getLifecycleStageCategories()
        : getBuildingElementCategories();
      
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              formatter={(value: number, name: string) => {
                const category = categories.find(cat => cat.key === name);
                return [`${value} ${valueType === 'per-sqm' ? 'kgCO2e/m²' : 'kgCO2e total'}`, category?.label || name];
              }}
              labelFormatter={(label) => `Project: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => {
                const category = categories.find(cat => cat.key === value);
                return category?.label || value;
              }}
            />
            {categories.map((category) => (
              <Bar 
                key={category.key}
                dataKey={category.key}
                stackId="embodiedCarbon"
                fill={category.color}
                name={category.label}
              />
            ))}
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
                    const baseId = data.id.split('-')[0];
                    const area = getProjectArea(baseId);
                    const displayName = isComparingToSelf && data.ribaStage 
                      ? `${addProjectNumberToName(data.name, parseInt(baseId) - 1)} (RIBA ${data.ribaStage.replace('stage-', '')})`
                      : addProjectNumberToName(data.name, parseInt(data.id) - 1);
                    
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{displayName}</p>
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
                  const baseId = project.id.split('-')[0];
                  const area = getProjectArea(baseId);
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
                dataKey={(item) => {
                  const baseId = item.id.split('-')[0];
                  const displayName = isComparingToSelf && item.ribaStage 
                    ? `${addProjectNumberToName(item.name, parseInt(baseId) - 1)} (RIBA ${item.ribaStage.replace('stage-', '')})`
                    : addProjectNumberToName(item.name, parseInt(item.id) - 1);
                  return displayName;
                }}
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
          .map(project => {
            const baseId = project.id.split('-')[0];
            const displayName = isComparingToSelf && project.ribaStage 
              ? `${addProjectNumberToName(project.name, parseInt(baseId) - 1)} (RIBA ${project.ribaStage.replace('stage-', '')})`
              : addProjectNumberToName(project.name, parseInt(project.id) - 1);
            
            return {
              ...project,
              displayName,
              date: new Date(project.completionDate).getTime()
            };
          })
          .sort((a, b) => a.date - b.date);

        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.displayName}</p>
                        <p className="text-sm text-gray-600">Completion: {data.completionDate}</p>
                        <p className="text-sm">
                          {kpi1Config?.label}: {data[selectedKPI1]} {getUnitLabel(kpi1Config?.unit || '', valueType)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                dataKey={selectedKPI1}
                fill="#3b82f6" 
                stroke="#3b82f6"
                strokeWidth={2}
                r={6}
              />
            </ScatterChart>
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
