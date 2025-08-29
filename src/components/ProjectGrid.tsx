import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { Building, Calendar, MapPin, Zap, Factory } from 'lucide-react';

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
  primaryProject 
}: ProjectGridProps) => {
  
  const formatNumber = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return value.toLocaleString();
  };

  const getPerformanceColor = (value: number, benchmarkLow: number, benchmarkHigh: number) => {
    if (value <= benchmarkLow) return 'text-green-600';
    if (value <= benchmarkHigh) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOperationalEnergy = (project: Project) => {
    const lastStage = project.ribaStageData[project.ribaStageData.length - 1];
    return lastStage?.operationalEnergyTotal || 0;
  };

  const getEmbodiedCarbon = (project: Project) => {
    const lastStage = project.ribaStageData[project.ribaStageData.length - 1];
    return lastStage?.totalEmbodiedCarbon || 0;
  };

  const getRibaStageDisplay = (project: Project) => {
    const lastStage = project.ribaStageData[project.ribaStageData.length - 1];
    return lastStage?.ribaStage?.replace('stage-', '') || '?';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Project Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => {
            const operationalEnergy = getOperationalEnergy(project);
            const embodiedCarbon = getEmbodiedCarbon(project);
            
            return (
              <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {project.primarySector}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      RIBA {getRibaStageDisplay(project)}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {project.projectName}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.projectLocation}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.pcDate).getFullYear()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      <span className="text-gray-600">GIA</span>
                    </div>
                    <span className="font-medium">{formatNumber(project.gia)} m²</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span className="text-gray-600">Operational Energy</span>
                    </div>
                    <span className={`font-medium ${getPerformanceColor(operationalEnergy, 50, 100)}`}>
                      {formatNumber(operationalEnergy)} kWh/m²/yr
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Factory className="h-3 w-3" />
                      <span className="text-gray-600">Embodied Carbon</span>
                    </div>
                    <span className={`font-medium ${getPerformanceColor(embodiedCarbon, 300, 600)}`}>
                      {formatNumber(embodiedCarbon)} kgCO2e/m²
                    </span>
                  </div>

                  {project.projectType === 'Retrofit' && project.operationalEnergyEB && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Existing Building</span>
                      <span className="font-medium">
                        {formatNumber(project.operationalEnergyEB)} kWh/m²/yr
                      </span>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                {(project.breeam || project.leed || project.well || project.uknzcbs) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-600 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-1">
                      {project.breeam && project.breeam !== 'N/A' && (
                        <Badge variant="secondary" className="text-xs">BREEAM {project.breeam}</Badge>
                      )}
                      {project.leed && project.leed !== 'N/A' && (
                        <Badge variant="secondary" className="text-xs">LEED {project.leed}</Badge>
                      )}
                      {project.well && project.well !== 'N/A' && (
                        <Badge variant="secondary" className="text-xs">WELL {project.well}</Badge>
                      )}
                      {project.uknzcbs && project.uknzcbs.includes('Yes') && (
                        <Badge variant="secondary" className="text-xs">UKNZCBS</Badge>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};