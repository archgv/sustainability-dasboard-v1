
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Project } from '@/types/project';

interface ChartSectionProps {
  projects: Project[];
}

export const ChartSection = ({ projects }: ChartSectionProps) => {
  // Prepare data for bar chart - group by typology
  const barChartData = projects.reduce((acc: any[], project) => {
    const existing = acc.find(item => item.typology === project.typology);
    if (existing) {
      existing.avgCarbon = (existing.avgCarbon + project.carbonIntensity) / 2;
      existing.avgEnergy = (existing.avgEnergy + project.operationalEnergy) / 2;
      existing.count += 1;
    } else {
      acc.push({
        typology: project.typology,
        avgCarbon: project.carbonIntensity,
        avgEnergy: project.operationalEnergy,
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
                  dataKey="carbonIntensity" 
                  name="Carbon Intensity"
                  unit=" kgCO2e/m²/yr"
                />
                <YAxis 
                  type="number" 
                  dataKey="operationalEnergy" 
                  name="Operational Energy"
                  unit=" kWh/m²/yr"
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
                          <p className="text-sm">Carbon: {data.carbonIntensity} kgCO2e/m²/yr</p>
                          <p className="text-sm">Energy: {data.operationalEnergy} kWh/m²/yr</p>
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
                  dataKey="avgCarbon" 
                  fill="#EF4444" 
                  name="Avg Carbon Intensity"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="avgEnergy" 
                  fill="#10B981" 
                  name="Avg Operational Energy"
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
