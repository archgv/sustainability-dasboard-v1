
import { useState } from 'react';
import { FilterPanel } from '@/components/FilterPanel';
import { ChartSection } from '@/components/ChartSection';
import { ProjectGrid } from '@/components/ProjectGrid';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AddProjectData } from '@/components/AddProjectData';
import { ChartTypeSelector, ChartType, EmbodiedCarbonBreakdown, ValueType } from '@/components/ChartTypeSelector';
import { ProjectComparison } from '@/components/ProjectComparison';
import { SectorPerformance } from '@/components/SectorPerformance';
import { CertificationAnalysis } from '@/components/CertificationAnalysis';
import { sampleProjects } from '@/data/sampleData';

const Index = () => {
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
  const [chartType, setChartType] = useState<ChartType>('compare-bubble');
  const [selectedKPI1, setSelectedKPI1] = useState('totalEmbodiedCarbon');
  const [selectedKPI2, setSelectedKPI2] = useState('refrigerants');
  const [embodiedCarbonBreakdown, setEmbodiedCarbonBreakdown] = useState<EmbodiedCarbonBreakdown>('none');
  const [valueType, setValueType] = useState<ValueType>('per-sqm');
  const [primaryProject, setPrimaryProject] = useState(sampleProjects[0]?.id || '');
  const [comparisonProjects, setComparisonProjects] = useState<string[]>([]);
  const [compareToSelf, setCompareToSelf] = useState(false);
  const [selectedRibaStages, setSelectedRibaStages] = useState<string[]>([]);
  const [anonymizeProjects, setAnonymizeProjects] = useState(false);
  const [filters, setFilters] = useState({
    typology: 'all',
    projectType: 'all',
    ribaStage: 'all',
    dateRange: 'all',
    carbonRange: [0, 100],
    energyRange: [0, 200]
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    const filtered = sampleProjects.filter(project => {
      const typologyMatch = newFilters.typology === 'all' || project.typology === newFilters.typology;
      const projectTypeMatch = newFilters.projectType === 'all' || project.projectType === newFilters.projectType;
      const ribaStageMatch = newFilters.ribaStage === 'all' || project.ribaStage === newFilters.ribaStage;
      const carbonMatch = project.carbonIntensity >= newFilters.carbonRange[0] && 
                         project.carbonIntensity <= newFilters.carbonRange[1];
      const energyMatch = project.operationalEnergy >= newFilters.energyRange[0] && 
                         project.operationalEnergy <= newFilters.energyRange[1];
      
      let dateMatch = true;
      if (newFilters.dateRange !== 'all') {
        const projectYear = new Date(project.completionDate).getFullYear();
        const currentYear = new Date().getFullYear();
        
        switch (newFilters.dateRange) {
          case 'recent':
            dateMatch = currentYear - projectYear <= 2;
            break;
          case 'older':
            dateMatch = currentYear - projectYear > 2;
            break;
        }
      }
      
      return typologyMatch && projectTypeMatch && ribaStageMatch && carbonMatch && energyMatch && dateMatch;
    });
    
    setFilteredProjects(filtered);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      typology: 'all',
      projectType: 'all',
      ribaStage: 'all',
      dateRange: 'all',
      carbonRange: [0, 100],
      energyRange: [0, 200]
    };
    handleFilterChange(defaultFilters);
  };

  const handleComparisonChange = (projects: string[], compareToSelfFlag: boolean, ribaStages: string[]) => {
    setComparisonProjects(projects);
    setCompareToSelf(compareToSelfFlag);
    setSelectedRibaStages(ribaStages);
  };

  const getDisplayProjects = () => {
    // Handle self-comparison mode
    if (compareToSelf && selectedRibaStages.length > 0) {
      const primaryProjectData = filteredProjects.find(p => p.id === primaryProject);
      if (!primaryProjectData) return [];
      
      return selectedRibaStages.map(stageId => ({
        ...primaryProjectData,
        id: `${primaryProjectData.id}-${stageId}`,
        ribaStage: stageId as any,
        name: primaryProjectData.name
      }));
    }
    
    // Handle comparison mode with multiple projects
    if (comparisonProjects.length > 0) {
      const projectsToShow = [primaryProject, ...comparisonProjects];
      return filteredProjects.filter(p => projectsToShow.includes(p.id));
    }
    
    // Default: show only the primary project when no comparisons are selected
    if (primaryProject) {
      const primaryProjectData = filteredProjects.find(p => p.id === primaryProject);
      return primaryProjectData ? [primaryProjectData] : [];
    }
    
    // Fallback to all filtered projects if no primary project is selected
    return filteredProjects;
  };

  const displayProjects = getDisplayProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel - Fixed/Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <AddProjectData projects={sampleProjects} />
              <FilterPanel 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                anonymizeProjects={anonymizeProjects}
                onAnonymizeChange={setAnonymizeProjects}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Sector Performance Analysis */}
            <SectorPerformance projects={filteredProjects} />
            
            {/* Certification Analysis */}
            <CertificationAnalysis 
              projects={filteredProjects} 
              anonymizeProjects={anonymizeProjects}
              primaryProject={primaryProject}
            />
            
            {/* Project Comparison */}
            <ProjectComparison 
              projects={filteredProjects}
              primaryProject={primaryProject}
              comparisonProjects={comparisonProjects}
              onPrimaryProjectChange={setPrimaryProject}
              onComparisonProjectsChange={handleComparisonChange}
            />
            
            {/* Chart Type Selector */}
            <ChartTypeSelector 
              chartType={chartType}
              selectedKPI1={selectedKPI1}
              selectedKPI2={selectedKPI2}
              embodiedCarbonBreakdown={embodiedCarbonBreakdown}
              valueType={valueType}
              onChartTypeChange={setChartType}
              onKPI1Change={setSelectedKPI1}
              onKPI2Change={setSelectedKPI2}
              onEmbodiedCarbonBreakdownChange={setEmbodiedCarbonBreakdown}
              onValueTypeChange={setValueType}
            />
            
            {/* Charts Section */}
            <ChartSection 
              projects={displayProjects}
              chartType={chartType}
              selectedKPI1={selectedKPI1}
              selectedKPI2={selectedKPI2}
              embodiedCarbonBreakdown={embodiedCarbonBreakdown}
              valueType={valueType}
              isComparingToSelf={compareToSelf}
              selectedRibaStages={selectedRibaStages}
            />
            
            {/* Projects Grid */}
            <ProjectGrid 
              projects={displayProjects} 
              isComparingToSelf={compareToSelf}
              selectedRibaStages={selectedRibaStages}
              anonymizeProjects={anonymizeProjects}
              primaryProject={primaryProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
