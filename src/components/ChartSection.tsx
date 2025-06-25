
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Project, availableKPIs } from '@/types/project';

interface ChartSectionProps {
  projects: Project[];
  selectedKPI1: string;
  selectedKPI2: string;
}

export const ChartSection = ({ projects, selectedKPI1, selectedKPI2 }: ChartSectionProps) => {
  const kpi1Config = availableKPIs.find(kpi => kpi.key === selectedKPI1);
  const kpi2Config = availableKPIs.find(kpi => kpi.key === selectedKPI2);

  // Prepare data for bar chart - group by typology
  const barChartData = projects.reduce((acc: any[], project) => {
    const existing = acc.find(item => item.typology === project.typology);
    if (existing) {
      existing[`avg${selectedKPI1}`] = (existing[`avg${selectedKPI1}`] + (project[selectedKPI1 as keyof Project] as number)) / 2;
      existing[`avg${selectedKPI2}`] = (existing[`avg${selectedKPI2}`] + (project[selectedKPI2 as keyof Project] as number)) / 2;
      existing.count += 1;
    } else {
      acc.push({
        typology: project.typology,
        [`avg${selectedKPI1}`]: project[selectedKPI1 as keyof Project] as number,
        [`avg${selectedKPI2}`]: project[selectedKPI2 as keyof Project] as number,
        count: 1
      });
    }
    return acc;
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Analytics</h2>
      
      <Tabs defaultValue="scatter" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scatter">Correlation View</TabsTrigger>
          <TabsTrigger value="bar">Comparison View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scatter" className="mt-6">
          <div className="h-96">
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
                  fill="#3B82F6"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="bar" className="mt-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="typology" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey={`avg${selectedKPI1}`}
                  fill="#EF4444" 
                  name={`Avg ${kpi1Config?.label || selectedKPI1}`}
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey={`avg${selectedKPI2}`}
                  fill="#10B981" 
                  name={`Avg ${kpi2Config?.label || selectedKPI2}`}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
