
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Zap, Leaf, FileText } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectGridProps {
  projects: Project[];
  isComparingToSelf?: boolean;
  selectedRibaStages?: string[];
  primaryProject?: string;
}

export const ProjectGrid = ({ 
  projects, 
  isComparingToSelf = false, 
  selectedRibaStages = [],
  primaryProject = ''
}: ProjectGridProps) => {
  // Map typologies to the correct sectors
  const getSectorDisplay = (typology: string) => {
    const sectorMap: { [key: string]: string } = {
      'residential': 'Residential',
      'educational': 'Education',
      'healthcare': 'Healthcare',
      'infrastructure': 'Infrastructure',
      'CCC': 'CCC',
      'ccc': 'CCC',
      'office': 'Workplace',
      'retail': 'Workplace',
      'mixed-use': 'Workplace'
    };
    return sectorMap[typology] || 'Workplace';
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getPerformanceColor = (value: number, type: 'carbon' | 'energy') => {
    if (type === 'carbon') {
      if (value <= 700) return 'bg-green-100 text-green-800';
      if (value <= 800) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    } else {
      if (value <= 80) return 'bg-green-100 text-green-800';
      if (value <= 120) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
  };

  const getRibaStageDisplay = (stage: string) => {
    const stageNumber = stage.replace('stage-', '');
    return `RIBA Stage ${stageNumber}`;
  };

  const getProjectTypeColor = (type: string) => {
    return type === 'new-build' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const getDisplayName = (project: Project, index: number) => {
    return isComparingToSelf && project.ribaStage 
      ? `${project["Project Name"]} (${getRibaStageDisplay(project.ribaStage)})`
      : project["Project Name"];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isComparingToSelf ? 'Project RIBA Stages' : 'Project Portfolio'}
        </h2>
        <div className="text-sm text-gray-500">
          Showing {formatNumber(projects.length)} {isComparingToSelf ? 'stages' : 'projects'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const displayName = getDisplayName(project, index);
          const sectorDisplay = getSectorDisplay(project["Primary Sector"]);
          
          return (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {displayName}
                </h3>
                <span className="ml-2 capitalize text-sm text-gray-600">
                  {sectorDisplay}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project["Project Location"]}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {project.ribaStage === 'stage-7' ? 
                    `PC date ${new Date(project["PC Date"]).getFullYear()}` :
                    `PC date ${new Date(project["PC Date"]).getFullYear()}`
                  }
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="text-sm text-gray-600">
                    {getRibaStageDisplay(project.ribaStage)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Project Type:</span> {project["Project Type"] === 'new-build' ? 'New Build' : 'Retrofit'}
                </div>
                
                <div className="text-sm text-gray-600">
                  <span className="font-medium">GIA:</span> {formatNumber(project["GIA"] || 0)} m²
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Embodied Carbon</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatNumber(project["Total Embodied Carbon"])} kgCO2e/m²
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Operational Energy</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatNumber(project["Operational Energy Total"])} kWh/m²/yr
                  </span>
                </div>
                
                {project["Project Type"] === 'retrofit' && project["Operational Energy Existing Building"] && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="text-sm text-gray-600">Existing Building Energy</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatNumber(project["Operational Energy Existing Building"])} kWh/m²/yr
                    </span>
                  </div>
                )}
              </div>
              
              {/* {project.certifications && project.certifications.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-1">
                    {project.certifications.map((cert, index) => (
                      <span key={index} className="text-xs text-gray-600 mr-2">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
