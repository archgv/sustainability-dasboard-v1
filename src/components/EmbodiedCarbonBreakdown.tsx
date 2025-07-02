
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Project } from '@/types/project';

interface EmbodiedCarbonBreakdownProps {
  project: Project;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export const EmbodiedCarbonBreakdown = ({ project }: EmbodiedCarbonBreakdownProps) => {
  if (!project.embodiedCarbonBreakdown) return null;

  const lifeCycleData = Object.entries(project.embodiedCarbonBreakdown.byLifeCycleStage).map(([stage, value]) => ({
    stage: stage.toUpperCase(),
    value,
    name: getLifeCycleStageName(stage)
  }));

  const buildingElementData = Object.entries(project.embodiedCarbonBreakdown.byBuildingElement).map(([element, value]) => ({
    element: element.charAt(0).toUpperCase() + element.slice(1),
    value,
    name: element.charAt(0).toUpperCase() + element.slice(1)
  }));

  function getLifeCycleStageName(stage: string): string {
    const stageNames: Record<string, string> = {
      a1a3: 'Product Stage',
      a4: 'Transport',
      a5: 'Construction',
      b1b7: 'Use Stage',
      c1c4: 'End of Life',
      d: 'Benefits Beyond System'
    };
    return stageNames[stage] || stage;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Embodied Carbon Breakdown - {project.name}
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Total Embodied Carbon: {project.totalEmbodiedCarbon} kgCO2e/m²
      </p>
      
      <Tabs defaultValue="lifecycle" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lifecycle">By Life Cycle Stage</TabsTrigger>
          <TabsTrigger value="element">By Building Element</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lifecycle" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Bar Chart</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifeCycleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kgCO2e/m²`, 'Carbon']} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Pie Chart</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifeCycleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {lifeCycleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kgCO2e/m²`, 'Carbon']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="element" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Bar Chart</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buildingElementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="element" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kgCO2e/m²`, 'Carbon']} />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Pie Chart</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={buildingElementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {buildingElementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kgCO2e/m²`, 'Carbon']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
