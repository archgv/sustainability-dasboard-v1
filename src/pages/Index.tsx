
import { useState } from 'react';
import { FilterPanel } from '@/components/FilterPanel';
import { ChartSection } from '@/components/ChartSection';
import { ProjectGrid } from '@/components/ProjectGrid';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ChartTypeSelector, ChartType } from '@/components/ChartTypeSelector';
import { ProjectComparison } from '@/components/ProjectComparison';
import { EmbodiedCarbonBreakdown } from '@/components/EmbodiedCarbonBreakdown';
import { SectorPerformance } from '@/components/SectorPerformance';
import { sampleProjects } from '@/data/sampleData';

const Index = () => {
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
  const [chartType, setChartType] = useState<ChartType>('compare-scatter');
  const [selectedKPI1, setSelectedKPI1] = useState('totalEmbodiedCarbon');
  const [selectedKPI2, setSelectedKPI2] = useState('operationalEnergy');
  const [primaryProject, setPrimaryProject] = useState(sampleProjects[0]?.id || '');
  const [comparisonProjects, setComparisonProjects] = useState<string[]>([]);
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
    
    // Apply filters to projects
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

  const primaryProjectData = sampleProjects.find(p => p.id === primaryProject);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Sector Performance Analysis */}
            <SectorPerformance projects={filteredProjects} />
            
            {/* Project Comparison */}
            <ProjectComparison 
              projects={filteredProjects}
              primaryProject={primaryProject}
              comparisonProjects={comparisonProjects}
              onPrimaryProjectChange={setPrimaryProject}
              onComparisonProjectsChange={setComparisonProjects}
            />
            
            {/* Chart Type Selector */}
            <ChartTypeSelector 
              chartType={chartType}
              selectedKPI1={selectedKPI1}
              selectedKPI2={selectedKPI2}
              onChartTypeChange={setChartType}
              onKPI1Change={setSelectedKPI1}
              onKPI2Change={setSelectedKPI2}
            />
            
            {/* Charts Section */}
            <ChartSection 
              projects={filteredProjects} 
              chartType={chartType}
              selectedKPI1={selectedKPI1}
              selectedKPI2={selectedKPI2}
            />
            
            {/* Embodied Carbon Breakdown */}
            {primaryProjectData && (
              <EmbodiedCarbonBreakdown project={primaryProjectData} />
            )}
            
            {/* Projects Grid */}
            <ProjectGrid projects={filteredProjects} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
