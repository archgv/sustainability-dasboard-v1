
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Project } from '@/types/project';
import { Building2, Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';
import { addProjectNumberToName } from '@/utils/projectUtils';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [compareToSelf, setCompareToSelf] = useState(false);
  const [selectedRibaStages, setSelectedRibaStages] = useState<string[]>([]);

  const ribaStages = [
    { id: 'stage-1', label: 'RIBA 1' },
    { id: 'stage-2', label: 'RIBA 2' },
    { id: 'stage-3', label: 'RIBA 3' },
    { id: 'stage-4', label: 'RIBA 4' },
    { id: 'stage-5', label: 'RIBA 5' },
    { id: 'stage-6', label: 'RIBA 6' },
    { id: 'stage-7', label: 'RIBA 7' }
  ];

  const handleComparisonToggle = (projectId: string) => {
    const isSelected = comparisonProjects.includes(projectId);
    if (isSelected) {
      onComparisonProjectsChange(comparisonProjects.filter(id => id !== projectId));
    } else {
      onComparisonProjectsChange([...comparisonProjects, projectId]);
    }
  };

  const handleRibaStageToggle = (stageId: string) => {
    const isSelected = selectedRibaStages.includes(stageId);
    if (isSelected) {
      setSelectedRibaStages(selectedRibaStages.filter(id => id !== stageId));
    } else {
      setSelectedRibaStages([...selectedRibaStages, stageId]);
    }
  };

  const filteredProjects = projects.filter(project => {
    const projectWithNumber = addProjectNumberToName(project.name, parseInt(project.id) - 1);
    return projectWithNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const primaryProjectData = projects.find(p => p.id === primaryProject);

  const getComparisonCount = () => {
    if (compareToSelf) {
      return selectedRibaStages.length;
    }
    return comparisonProjects.length;
  };

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Comparison</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Project Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Primary Project
          </Label>
          <div className="space-y-2">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <Select value={primaryProject} onValueChange={onPrimaryProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary project" />
              </SelectTrigger>
              <SelectContent>
                {filteredProjects.map((project, index) => (
                  <SelectItem key={project.id} value={project.id}>
                    {addProjectNumberToName(project.name, parseInt(project.id) - 1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {primaryProjectData && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {addProjectNumberToName(primaryProjectData.name, parseInt(primaryProjectData.id) - 1)}
                </span>
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

        {/* Comparison Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Compare With ({getComparisonCount()} selected)
          </Label>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="compare-to-self"
                checked={compareToSelf}
                onCheckedChange={(checked) => {
                  setCompareToSelf(checked as boolean);
                  if (checked) {
                    onComparisonProjectsChange([]);
                  } else {
                    setSelectedRibaStages([]);
                  }
                }}
              />
              <label htmlFor="compare-to-self" className="text-sm font-medium">
                Compare to itself (RIBA Stages)
              </label>
            </div>
          </div>

          {compareToSelf ? (
            /* RIBA Stage Selection */
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ribaStages.map((stage) => (
                <div
                  key={stage.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRibaStages.includes(stage.id)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRibaStageToggle(stage.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{stage.label}</span>
                    <div className={`w-4 h-4 rounded border-2 ${
                      selectedRibaStages.includes(stage.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedRibaStages.includes(stage.id) && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Project Selection */
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredProjects
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
                        <p className="font-medium text-gray-900">
                          {addProjectNumberToName(project.name, parseInt(project.id) - 1)}
                        </p>
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
          )}
        </div>
      </div>
    </Card>
  );
};
