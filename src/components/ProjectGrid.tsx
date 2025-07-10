
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Zap, Leaf, Eye, EyeOff } from 'lucide-react';
import { Project } from '@/types/project';
import { addProjectNumberToName } from '@/utils/projectUtils';
import { useState } from 'react';

interface ProjectGridProps {
  projects: Project[];
  isComparingToSelf?: boolean;
  selectedRibaStages?: string[];
}

export const ProjectGrid = ({ 
  projects, 
  isComparingToSelf = false, 
  selectedRibaStages = [] 
}: ProjectGridProps) => {
  const [isAnonymized, setIsAnonymized] = useState(false);

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

  const getAnonymizedName = (index: number) => {
    return `Project ${String.fromCharCode(65 + index)}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isComparingToSelf ? 'Project RIBA Stages' : 'Project Portfolio'}
        </h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnonymized(!isAnonymized)}
            className="flex items-center gap-2"
          >
            {isAnonymized ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isAnonymized ? 'Show Names' : 'Anonymize'}
          </Button>
          <div className="text-sm text-gray-500">
            Showing {projects.length} {isComparingToSelf ? 'stages' : 'projects'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const baseId = project.id.split('-')[0];
          let displayName = '';
          
          if (isAnonymized) {
            displayName = getAnonymizedName(index);
          } else if (isComparingToSelf && project.ribaStage) {
            displayName = `${addProjectNumberToName(project.name, parseInt(baseId) - 1)} (${getRibaStageDisplay(project.ribaStage)})`;
          } else {
            displayName = addProjectNumberToName(project.name, parseInt(project.id) - 1);
          }
          
          return (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {displayName}
                </h3>
                <Badge variant="outline" className="ml-2 capitalize">
                  {project.typology}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {project.ribaStage === 'stage-7' ? 
                    `Completed ${new Date(project.completionDate).getFullYear()}` :
                    getRibaStageDisplay(project.ribaStage)
                  }
                </div>
                <div className="flex gap-2">
                  <Badge className={getProjectTypeColor(project.projectType)}>
                    {project.projectType === 'new-build' ? 'New Build' : 'Retrofit'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Embodied Carbon</span>
                  </div>
                  <Badge className={getPerformanceColor(project.totalEmbodiedCarbon, 'carbon')}>
                    {project.totalEmbodiedCarbon} kgCO2e/m²
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Operational Energy</span>
                  </div>
                  <Badge className={getPerformanceColor(project.operationalEnergy, 'energy')}>
                    {project.operationalEnergy} kWh/m²/yr
                  </Badge>
                </div>
              </div>
              
              {project.certifications && project.certifications.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-1">
                    {project.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
