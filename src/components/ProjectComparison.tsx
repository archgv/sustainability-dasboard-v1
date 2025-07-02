
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { Building2, Calendar, MapPin } from 'lucide-react';

interface ProjectComparisonProps {
  projects: Project[];
  primaryProject: string;
  comparisonProjects: string[];
  onPrimaryProjectChange: (projectId: string) => void;
  onComparisonProjectsChange: (projectIds: string[]) => void;
}

export const ProjectComparison = ({ 
  projects, 
  primaryProject, 
  comparisonProjects,
  onPrimaryProjectChange,
  onComparisonProjectsChange
}: ProjectComparisonProps) => {
  const handleComparisonToggle = (projectId: string) => {
    const isSelected = comparisonProjects.includes(projectId);
    if (isSelected) {
      onComparisonProjectsChange(comparisonProjects.filter(id => id !== projectId));
    } else {
      onComparisonProjectsChange([...comparisonProjects, projectId]);
    }
  };

  const primaryProjectData = projects.find(p => p.id === primaryProject);

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Comparison</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Project Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Primary Project
          </Label>
          <Select value={primaryProject} onValueChange={onPrimaryProjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {primaryProjectData && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">{primaryProjectData.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {primaryProjectData.location}
                </div>
                <Badge variant="outline" className="capitalize">
                  {primaryProjectData.typology}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {primaryProjectData.projectType}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Projects */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Compare With ({comparisonProjects.length} selected)
          </Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projects
              .filter(p => p.id !== primaryProject)
              .map((project) => (
                <div
                  key={project.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    comparisonProjects.includes(project.id)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleComparisonToggle(project.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {project.typology}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {project.projectType}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          RIBA {project.ribaStage.replace('stage-', '')}
                        </span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded border-2 ${
                      comparisonProjects.includes(project.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}>
                      {comparisonProjects.includes(project.id) && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
