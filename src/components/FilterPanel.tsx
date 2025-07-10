
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { Project } from '@/types/project';

interface FilterPanelProps {
  projects: Project[];
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
  selectedKPIs: string[];
  onKPIsChange: (kpis: string[]) => void;
  selectedProjects: string[];
  onProjectsChange: (projectIds: string[]) => void;
  chartType: 'bar' | 'line' | 'scatter';
  onChartTypeChange: (type: 'bar' | 'line' | 'scatter') => void;
  comparisonMode: 'projects' | 'self';
  onComparisonModeChange: (mode: 'projects' | 'self') => void;
  selectedRibaStages: string[];
  onRibaStagesChange: (stages: string[]) => void;
}

export const FilterPanel = ({ 
  projects,
  selectedProject,
  onProjectChange,
  selectedKPIs,
  onKPIsChange,
  selectedProjects,
  onProjectsChange,
  chartType,
  onChartTypeChange,
  comparisonMode,
  onComparisonModeChange,
  selectedRibaStages,
  onRibaStagesChange
}: FilterPanelProps) => {
  const availableKPIs = [
    { key: 'totalEmbodiedCarbon', label: 'Embodied Carbon' },
    { key: 'operationalEnergy', label: 'Operational Energy' },
    { key: 'operationalWaterUse', label: 'Water Use' },
    { key: 'socialValue', label: 'Social Value' }
  ];

  const ribaStages = [
    { id: 'stage-1', label: 'RIBA 1' },
    { id: 'stage-2', label: 'RIBA 2' },
    { id: 'stage-3', label: 'RIBA 3' },
    { id: 'stage-4', label: 'RIBA 4' },
    { id: 'stage-5', label: 'RIBA 5' },
    { id: 'stage-6', label: 'RIBA 6' },
    { id: 'stage-7', label: 'RIBA 7' }
  ];

  return (
    <Card className="p-6 sticky top-8">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters & Comparison</h3>
      </div>
      
      <div className="space-y-6">
        {/* Comparison Mode */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Comparison Mode
          </Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="projects-mode"
                checked={comparisonMode === 'projects'}
                onCheckedChange={() => onComparisonModeChange('projects')}
              />
              <label htmlFor="projects-mode" className="text-sm">Compare Projects</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="self-mode"
                checked={comparisonMode === 'self'}
                onCheckedChange={() => onComparisonModeChange('self')}
              />
              <label htmlFor="self-mode" className="text-sm">Compare RIBA Stages</label>
            </div>
          </div>
        </div>

        {/* Primary Project Selection */}
        {comparisonMode === 'self' && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Project
            </Label>
            <Select value={selectedProject} onValueChange={onProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* RIBA Stages Selection */}
        {comparisonMode === 'self' && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              RIBA Stages ({selectedRibaStages.length} selected)
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ribaStages.map((stage) => (
                <div key={stage.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={stage.id}
                    checked={selectedRibaStages.includes(stage.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onRibaStagesChange([...selectedRibaStages, stage.id]);
                      } else {
                        onRibaStagesChange(selectedRibaStages.filter(id => id !== stage.id));
                      }
                    }}
                  />
                  <label htmlFor={stage.id} className="text-sm">{stage.label}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Selection for comparison */}
        {comparisonMode === 'projects' && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Projects ({selectedProjects.length} selected)
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={project.id}
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onProjectsChange([...selectedProjects, project.id]);
                      } else {
                        onProjectsChange(selectedProjects.filter(id => id !== project.id));
                      }
                    }}
                  />
                  <label htmlFor={project.id} className="text-sm">{project.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPI Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            KPIs to Display
          </Label>
          <div className="space-y-2">
            {availableKPIs.map((kpi) => (
              <div key={kpi.key} className="flex items-center space-x-2">
                <Checkbox
                  id={kpi.key}
                  checked={selectedKPIs.includes(kpi.key)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onKPIsChange([...selectedKPIs, kpi.key]);
                    } else {
                      onKPIsChange(selectedKPIs.filter(k => k !== kpi.key));
                    }
                  }}
                />
                <label htmlFor={kpi.key} className="text-sm">{kpi.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Type */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Chart Type
          </Label>
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
