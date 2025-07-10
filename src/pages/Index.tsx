import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FilterPanel } from '@/components/FilterPanel';
import { ProjectGrid } from '@/components/ProjectGrid';
import { ChartSection } from '@/components/ChartSection';
import { SectorPerformance } from '@/components/SectorPerformance';
import { CertificationAnalysis } from '@/components/CertificationAnalysis';
import { ProjectComparison } from '@/components/ProjectComparison';
import { EmbodiedCarbonBreakdown } from '@/components/EmbodiedCarbonBreakdown';
import { sampleProjects } from '@/data/sampleData';
import { Project } from '@/types/project';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>(['totalEmbodiedCarbon', 'operationalEnergy']);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'scatter'>('bar');
  const [comparisonMode, setComparisonMode] = useState<'projects' | 'self'>('projects');
  const [selectedRibaStages, setSelectedRibaStages] = useState<string[]>([]);

  const getFilteredProjects = (): Project[] => {
    if (comparisonMode === 'self' && selectedProject) {
      const baseProject = sampleProjects.find(p => p.id === selectedProject);
      if (!baseProject) return [];

      if (selectedRibaStages.length === 0) return [baseProject];

      return selectedRibaStages.map(stage => ({
        ...baseProject,
        id: `${baseProject.id}-${stage}`,
        ribaStage: stage as Project['ribaStage'],
        // Simulate different values for different stages
        totalEmbodiedCarbon: baseProject.totalEmbodiedCarbon * (stage === 'stage-1' ? 0.3 : stage === 'stage-2' ? 0.5 : stage === 'stage-3' ? 0.7 : stage === 'stage-4' ? 0.85 : 1),
        operationalEnergy: baseProject.operationalEnergy * (stage === 'stage-1' ? 1.2 : stage === 'stage-2' ? 1.1 : stage === 'stage-3' ? 1.05 : stage === 'stage-4' ? 1.02 : 1),
      }));
    }

    if (selectedProjects.length > 0) {
      return sampleProjects.filter(project => selectedProjects.includes(project.id));
    }

    return sampleProjects;
  };

  const filteredProjects = getFilteredProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8 space-y-8">
        <FilterPanel
          projects={sampleProjects}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          selectedKPIs={selectedKPIs}
          onKPIsChange={setSelectedKPIs}
          selectedProjects={selectedProjects}
          onProjectsChange={setSelectedProjects}
          chartType={chartType}
          onChartTypeChange={setChartType}
          comparisonMode={comparisonMode}
          onComparisonModeChange={setComparisonMode}
          selectedRibaStages={selectedRibaStages}
          onRibaStagesChange={setSelectedRibaStages}
        />

        <ProjectGrid 
          projects={filteredProjects} 
          isComparingToSelf={comparisonMode === 'self'}
          selectedRibaStages={selectedRibaStages}
        />

        <ChartSection
          projects={filteredProjects}
          selectedKPIs={selectedKPIs}
          chartType={chartType}
          comparisonMode={comparisonMode}
        />

        <SectorPerformance projects={sampleProjects} />

        <CertificationAnalysis projects={sampleProjects} />

        <ProjectComparison projects={filteredProjects} />

        <EmbodiedCarbonBreakdown projects={filteredProjects} />
      </div>
    </div>
  );
};

export default Index;
